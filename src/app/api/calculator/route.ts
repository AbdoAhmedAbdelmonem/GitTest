import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

interface CalculatorResult {
  expression: string;
  mode: string;
  angle_mode: string;
  result: number | string | unknown[] | Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const { expression, mode = 'basic', angleMode = 'deg' } = await request.json();

    if (!expression || typeof expression !== 'string') {
      return NextResponse.json(
        { error: 'Expression is required and must be a string' },
        { status: 400 }
      );
    }

    // Path to the Python calculator script
    const scriptPath = path.join(process.cwd(), 'scripts', 'calculator_backend.py');

    // Run the Python script
    const result = await runPythonCalculator(scriptPath, expression, mode, angleMode);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculator API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function runPythonCalculator(scriptPath: string, expression: string, mode: string, angleMode: string): Promise<CalculatorResult> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      scriptPath,
      expression,
      mode,
      angleMode
    ], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}. Stderr: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (parseError) {
        reject(new Error(`Failed to parse Python output: ${stdout}. Error: ${parseError}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });

    // Set a timeout
    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Python calculation timed out'));
    }, 10000); // 10 second timeout
  });
}
