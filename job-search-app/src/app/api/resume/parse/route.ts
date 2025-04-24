import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Temporary directory for storing uploaded resumes
const UPLOAD_DIR = path.join(process.cwd(), 'tmp');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Check file type
    const fileType = file.type;
    if (fileType !== 'application/pdf' && !fileType.includes('word')) {
      return NextResponse.json(
        { error: 'Only PDF and Word documents are supported' },
        { status: 400 }
      );
    }
    
    // Create a buffer from the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    
    // Ensure upload directory exists
    await execPromise(`mkdir -p ${UPLOAD_DIR}`);
    
    // Write the file to disk
    await writeFile(filepath, buffer);
    
    // Call the Python script to parse the resume
    const scriptPath = path.join(process.cwd(), 'src/lib/resumeAnalyzer.py');
    const { stdout, stderr } = await execPromise(`python ${scriptPath} ${filepath}`);
    
    if (stderr) {
      console.error('Error parsing resume:', stderr);
      return NextResponse.json(
        { error: 'Failed to parse resume' },
        { status: 500 }
      );
    }
    
    // Parse the output from the Python script
    try {
      // Extract the keywords from the output
      const outputLines = stdout.split('\n');
      let keywords: string[] = [];
      
      for (const line of outputLines) {
        if (line.startsWith('Keywords:')) {
          // Extract the keywords list
          const keywordsStr = line.replace('Keywords:', '').trim();
          // Remove the square brackets and split by comma
          keywords = keywordsStr
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map(k => k.trim().replace(/^'|'$/g, ''));
          break;
        }
      }
      
      return NextResponse.json({ 
        success: true,
        keywords,
        filename
      });
    } catch (error) {
      console.error('Error parsing Python output:', error);
      return NextResponse.json(
        { error: 'Failed to parse resume analysis results' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}
