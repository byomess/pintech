import data from './data.json';

import {NextRequest, NextResponse} from "next/server";

export async function GET (request: NextRequest){    
    return NextResponse.json(data);
}