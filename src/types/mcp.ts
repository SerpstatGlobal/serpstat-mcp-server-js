export interface MCPToolCall {
    name: string;
    arguments: Record<string, any>;
}

export interface MCPToolResponse {
    content: Array<{
        type: "text";
        text: string;
    }>;
    isError?: boolean;
}