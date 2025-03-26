import { google } from '@ai-sdk/google';
import { streamText } from "ai"

// Allow responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage =
      messages
        .filter((m: any) => m.role === "user")
        .pop()
        ?.content.toLowerCase() || ""
        // Check for specific tax-related questions to enhance with visualizations
        let enhancedResponse = ""

        if (lastUserMessage.includes("tax bracket") || lastUserMessage.includes("how do tax brackets work")) {
          enhancedResponse = `Tax brackets define income ranges that are taxed at specific rates. Canada uses a progressive tax system, meaning different portions of your income are taxed at different rates.

For 2023, the federal income tax brackets are: 15%, 20.5%, 26%, 29%, and 33%. Your income is taxed at each applicable rate as it moves through these brackets.

For example, if you're a single filer:

The first $53,359 of your taxable income is taxed at 15%

Income between $53,359 and $106,717 is taxed at 20.5%

And so on up to the highest bracket

This means you don’t pay the highest rate on all your income—only on the portion that falls within each bracket.

[TAX_BRACKET_CHART]

Would you like me to estimate your tax liability based on your income?`
        } else if (lastUserMessage.includes("standard deduction")) {
          enhancedResponse = `For the 2023 tax year, instead of a standard deduction like in the U.S., Canada provides a Basic Personal Amount (BPA), which is a non-refundable tax credit that reduces the amount of income tax you owe.

The federal BPA for 2023 is:

$15,000 for most taxpayers

Provincial and territorial governments also set their own Basic Personal Amounts, which vary by region.

In Canada, you cannot choose between a standard deduction and itemized deductions. Instead, you can claim various tax credits and deductions for specific expenses, such as medical expenses, charitable donations, and employment expenses.

[TAX_BREAKDOWN_TABLE]

Would you like to learn more about available tax credits and deductions that may apply to you?`
        }

        // If we have an enhanced response, return it directly instead of using streamText
        if (enhancedResponse) {
          // Create a streaming response to match the AI response format
          const stream = new ReadableStream({
            async start(controller) {
              try {
                // Send initial message ID
                const messageId = `msg-${crypto.randomUUID().replace(/-/g, '')}`;
                controller.enqueue(`f:${JSON.stringify({messageId})}\n`);
                
                // Split the response into smaller chunks and stream them
                const chunkSize = 100; // Adjust size as needed
                for (let i = 0; i < enhancedResponse.length; i += chunkSize) {
                  const chunk = enhancedResponse.substring(i, i + chunkSize);
                  controller.enqueue(`0:${JSON.stringify(chunk)}\n`);
                  // Small delay to simulate streaming
                  await new Promise(resolve => setTimeout(resolve, 10));
                }
                
                // Send completion message
                const usage = { promptTokens: 100, completionTokens: enhancedResponse.length / 4 };
                controller.enqueue(`e:${JSON.stringify({finishReason: "stop", usage, isContinued: false})}\n`);
                controller.enqueue(`d:${JSON.stringify({finishReason: "stop", usage})}\n`);
                controller.close();
              } catch (error) {
                controller.error(error);
              }
            }
          });
          
          return new Response(stream);
        }

    // Otherwise, use the AI to generate a response
    try {
      const result = streamText({
        model: google('gemini-1.5-pro-latest'),
        messages,
        system: `You are a helpful tax assistant chatbot. Provide accurate, concise information about Canadian tax laws, forms, and procedures. 
        
        Focus on individual tax returns  and related topics. If users ask about specific tax situations, provide general guidance but remind them that you're not a certified tax professional and they should consult with a tax professional for personalized advice.
        
        When appropriate, mention relevant tax forms, deadlines, and resources. Be friendly and conversational while maintaining professionalism.
        
        For questions about tax brackets, include the [TAX_BRACKET_CHART] tag in your response.
        For questions about deductions, include the [TAX_BREAKDOWN_TABLE] tag in your response when relevant.`,
      })

      return result.toDataStreamResponse()
    } catch (error) {
      console.error("Error streaming AI response:", error)
      throw error
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
























