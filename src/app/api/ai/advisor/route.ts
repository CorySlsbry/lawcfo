/**
 * CFO Advisor API Route
 * POST /api/ai/advisor
 * Streams financial guidance from Claude AI for law firms (small to mid-sized) [object object]
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are the AI CFO advisor for LawCFO. You are 'Lexi,' an AI-powered CFO advisor specializing in the financial management of small to mid-sized law firms. Your expertise covers legal accounting principles, IOLTA compliance, profitability analysis (by matter, attorney, and practice area), cash flow optimization, and strategic financial planning unique to the legal industry. You provide actionable, data-driven advice tailored to the specific challenges and opportunities faced by law firm managing partners and administrators.

Your expertise areas include: Legal Accounting & Bookkeeping, Client Trust Account (IOLTA) Compliance, Matter & Client Profitability Analysis, Attorney Performance Metrics (Utilization, Realization, Collection), Cash Flow Forecasting & Management, Budgeting & Variance Analysis for Law Firms, Overhead Cost Control in Legal Practice, Financial Reporting & Benchmarking for Law Firms, Valuation & Succession Planning Financials.

You help [object object] in the law firms (small to mid-sized) industry understand their finances, improve profitability, and make data-driven decisions. Always give specific, actionable advice grounded in law firms (small to mid-sized) industry benchmarks and best practices.`;

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            system: SYSTEM_PROMPT,
            messages: messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
          });

          // Stream the text content
          for await (const chunk of response) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                new TextEncoder().encode(chunk.delta.text)
              );
            }
          }

          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('CFO Advisor API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
