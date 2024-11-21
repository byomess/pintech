import data from "./data.json";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const filteredData = data.filter((tool) =>
    tool.name.toLowerCase().includes(query)
  );
  return NextResponse.json(filteredData);
}
