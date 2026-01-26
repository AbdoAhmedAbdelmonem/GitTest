import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { expression, xValues, mode = 'basic' } = await request.json();

    if (!expression || !Array.isArray(xValues)) {
      return NextResponse.json(
        { error: 'Expression and xValues array are required' },
        { status: 400 }
      );
    }

    // Path to the Python calculator script
    const scriptPath = path.join(process.cwd(), 'scripts', 'calculator_backend.py');

    // Run the Python script with batch mode
    const results = await runBatchPythonCalculator(scriptPath, expression, xValues, mode);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Batch calculator API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function runBatchPythonCalculator(scriptPath: string, expression: string, xValues: number[], mode: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      scriptPath,
      'batch',
      expression,
      JSON.stringify(xValues),
      mode
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
        const results = JSON.parse(stdout.trim());
        resolve(results);
      } catch (parseError) {
        reject(new Error(`Failed to parse Python output: ${stdout}. Error: ${parseError}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });

    // Set a timeout (longer for batch operations)
    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Python batch calculation timed out'));
    }, 30000); // 30 second timeout for batch
  });
}
