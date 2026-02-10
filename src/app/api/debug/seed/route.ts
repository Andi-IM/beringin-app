// API Route: Seed Data (Debug Only)
// Using Edge Runtime for EdgeOne KV access

import { Registry } from '@/registry'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  // In a real app, this should be protected by API key or admin auth
  try {
    await Registry.seedInitialData()
    return NextResponse.json({ message: 'Seed data created successfully' })
  } catch (error) {
    console.error('Seed API Error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
