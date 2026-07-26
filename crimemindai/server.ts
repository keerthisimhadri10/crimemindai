import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { MOCK_CRIME_RECORDS, searchCrimeRecords } from './src/data/mockCrimeData';

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Initialize Gemini API Client server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt for Senior Crime Intelligence Analyst
const DETECTIVE_SYSTEM_PROMPT = `You are a Senior Crime Intelligence Analyst and Detective Copilot for the State Crime Records Bureau (SCRB), India.
Your task is to analyze crime records, discover hidden crime patterns, evaluate evidence, estimate hypotheses probability, calculate confidence scores, and provide actionable police directives.
You MUST be analytical, concise, evidence-driven, objective, and clear.
NEVER write conversational fluff or casual intros. Respond directly with structured investigation intelligence.`;

// API 1: Crime Records Search & Filter
app.get('/api/crime-records', (req, res) => {
  const query = (req.query.q as string) || '';
  const district = (req.query.district as string) || '';
  const crimeType = (req.query.crimeType as string) || '';
  const severity = (req.query.severity as string) || '';

  const results = searchCrimeRecords(query, { district, crimeType, severity });
  res.json({ success: true, count: results.length, data: results.slice(0, 100) });
});

// API 2: AI Investigation Mode
app.post('/api/investigate', async (req, res) => {
  try {
    const { query, districtFilter } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    // Filter relevant records from local database as context
    const matchingRecords = searchCrimeRecords(query, { district: districtFilter });
    const topContextRecords = (matchingRecords.length > 0 ? matchingRecords : MOCK_CRIME_RECORDS).slice(0, 15);

    const promptText = `
User Investigation Request: "${query}"
Context District: ${districtFilter || 'All SCRB Districts'}

Top Matching Crime FIR Records from Database:
${JSON.stringify(topContextRecords, null, 2)}

Provide a structured, deep investigation copilot analysis based on these records.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: DETECTIVE_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Short formal investigation title' },
                overview: { type: Type.STRING, description: 'Executive summary of findings' },
                patternsDetected: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of key criminal patterns identified'
                }
              },
              required: ['title', 'overview', 'patternsDetected']
            },
            keyFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-5 key investigative findings'
            },
            hypotheses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hypothesis: { type: Type.STRING },
                  confidence: { type: Type.NUMBER, description: 'Percentage 0-100' },
                  supportingPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['hypothesis', 'confidence', 'supportingPoints']
              }
            },
            evidenceUsed: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  firId: { type: Type.STRING },
                  description: { type: Type.STRING },
                  relevance: { type: Type.STRING }
                },
                required: ['firId', 'description', 'relevance']
              }
            },
            reasoning: { type: Type.STRING, description: 'Analytical reasoning linking evidence to conclusions' },
            confidenceScore: { type: Type.NUMBER, description: 'Overall confidence score 0 to 100' },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Operational police recommendations (e.g., night patrol, CCTV, plain-clothes officers)'
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Immediate next investigative steps'
            },
            matchedFirIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of FIR IDs referenced'
            }
          },
          required: [
            'summary',
            'keyFindings',
            'hypotheses',
            'evidenceUsed',
            'reasoning',
            'confidenceScore',
            'recommendations',
            'nextSteps',
            'matchedFirIds'
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');

    // Attach full crime records for matched IDs
    const matchedFirs = topContextRecords.filter(r =>
      parsedData.matchedFirIds?.includes(r.id)
    );

    res.json({
      success: true,
      data: {
        ...parsedData,
        query,
        matchedCases: matchedFirs.length > 0 ? matchedFirs : topContextRecords.slice(0, 4),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('API Investigate error:', error);
    res.status(500).json({ error: error.message || 'Failed to complete AI investigation' });
  }
});

// API 3: Connect the Dots (Criminal Network Discovery)
app.post('/api/connect-dots', async (req, res) => {
  try {
    const { district, focusSuspect } = req.body;

    // Filter crime records relevant to network analysis
    const sampleRecords = MOCK_CRIME_RECORDS.filter(
      r => (!district || district === 'All' || r.district === district) &&
           (!focusSuspect || r.suspect.toLowerCase().includes(focusSuspect.toLowerCase()))
    ).slice(0, 12);

    const promptText = `
Analyze the following crime records to discover hidden criminal networks, overlapping entities (vehicles, phones, associates, weapons, locations), and generate nodes and edges for a relationship graph.

Records:
${JSON.stringify(sampleRecords, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: DETECTIVE_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Executive summary explaining the network overlap' },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING, description: 'Person | Vehicle | Phone | Weapon | Case | Location | Associate' },
                  subtitle: { type: Type.STRING },
                  details: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ['id', 'label', 'type', 'subtitle', 'details']
              }
            },
            edges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                  label: { type: Type.STRING, description: 'e.g. Same Vehicle, Used Phone, Associates With, Crime Location' }
                },
                required: ['id', 'source', 'target', 'label']
              }
            },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                },
                required: ['title', 'description', 'confidence']
              }
            }
          },
          required: ['summary', 'nodes', 'edges', 'insights']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');

    // Layout node positions dynamically in grid or circle layout for React Flow
    const nodesCount = parsedData.nodes?.length || 0;
    const formattedNodes = (parsedData.nodes || []).map((node: any, idx: number) => {
      const angle = (idx / Math.max(1, nodesCount)) * 2 * Math.PI;
      const radius = 220 + (idx % 2) * 60;
      return {
        id: node.id,
        type: 'customCrimeNode',
        position: {
          x: Math.round(400 + radius * Math.cos(angle)),
          y: Math.round(300 + radius * Math.sin(angle))
        },
        data: {
          label: node.label,
          type: node.type,
          subtitle: node.subtitle,
          details: node.details,
          severity: node.severity || 'High'
        }
      };
    });

    const formattedEdges = (parsedData.edges || []).map((edge: any) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: '2px' }
    }));

    res.json({
      success: true,
      data: {
        summary: parsedData.summary,
        nodes: formattedNodes,
        edges: formattedEdges,
        insights: parsedData.insights
      }
    });
  } catch (error: any) {
    console.error('API Connect Dots error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze criminal network' });
  }
});

// API 4: Crime Prediction Simulator
app.post('/api/predict-scenario', async (req, res) => {
  try {
    const { patrolChange, isFestival, festivalName, cctvMultiplier, gangActive, gangName, customQuery } = req.body;

    const scenarioContext = `
Simulation Settings:
- Patrol Density Adjustment: ${patrolChange}%
- Festival / Mass Gathering Event: ${isFestival ? `YES (${festivalName || 'Major Public Festival'})` : 'NO'}
- CCTV Coverage Density: ${cctvMultiplier}x
- High-Risk Gang Activity: ${gangActive ? `YES (${gangName || 'Known Repeat Syndicate'})` : 'NO'}
- Custom Scenario Query: "${customQuery || 'Predict crime risk changes and resource allocation'}"

Historical Baseline Context:
- Active FIRs analyzed: 500 records
- High theft/burglary probability during night hours and public festivals
- Vehicle theft and pickpocketing spikes by 40-60% during crowded gatherings
- Higher patrol density reduces property crime by ~25%
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: scenarioContext,
      config: {
        systemInstruction: DETECTIVE_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioTitle: { type: Type.STRING },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  crimeType: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, description: 'CRITICAL | HIGH | MEDIUM | LOW' },
                  score: { type: Type.NUMBER, description: '0 to 100 risk percentage' },
                  trend: { type: Type.STRING, description: 'UP | DOWN | STABLE' },
                  details: { type: Type.STRING }
                },
                required: ['crimeType', 'riskLevel', 'score', 'trend', 'details']
              }
            },
            recommendedDeployment: {
              type: Type.OBJECT,
              properties: {
                officersCount: { type: Type.NUMBER },
                mobilePatrols: { type: Type.NUMBER },
                temporaryCCTV: { type: Type.NUMBER },
                drones: { type: Type.NUMBER },
                specialUnits: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['officersCount', 'mobilePatrols', 'temporaryCCTV', 'drones', 'specialUnits']
            },
            reasoning: { type: Type.STRING, description: 'Analytical rationale behind risk prediction' },
            confidenceScore: { type: Type.NUMBER, description: 'Confidence 0-100' },
            mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['scenarioTitle', 'risks', 'recommendedDeployment', 'reasoning', 'confidenceScore', 'mitigationSteps']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('API Predict Scenario error:', error);
    res.status(500).json({ error: error.message || 'Failed to run prediction simulation' });
  }
});

// Mount Vite middleware in development, or serve static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CrimeMind AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
