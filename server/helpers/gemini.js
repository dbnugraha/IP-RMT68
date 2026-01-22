// server/helpers/gemini.js - Add summary generation function
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

async function test() {
  try {
    return await gemini(
      "gemini-3-flash-preview",
      "As an AI business analyst, hello world! [introduce yourself in 7 words]",
    );
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

async function gemini(model, prompt) {
  const allowedModels = ["gemini-3-flash-preview", "gemini-3-pro", "gemini-3-pro-preview"];
  if (!allowedModels.includes(model)) {
    throw new Error(`Invalid model name: ${model}`);
  }
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

/**
 * Analyze business data and generate insights
 * @param {Object} businessContext - Aggregated business data
 * @param {string} userPrompt - Optional custom prompt
 * @returns {Promise<string>} AI-generated insights
 */
async function analyzeBusinessData(businessContext, userPrompt = "", language = "English") {
  const prompt = `
As an ${language} expert business analyst AI. Analyze the following business data and provide actionable insights and recommendations.

BUSINESS INFORMATION:
- Name: ${businessContext.business.name}
- Type: ${businessContext.business.type}
- Description: ${businessContext.business.description || "N/A"}

FINANCIAL SUMMARY:
- Total Income: Rp ${businessContext.financial.totalIncome.toLocaleString("id-ID")}
- Total Expense: Rp ${businessContext.financial.totalExpense.toLocaleString("id-ID")}
- Net Profit: Rp ${(businessContext.financial.totalIncome - businessContext.financial.totalExpense).toLocaleString("id-ID")}
- Income Transactions: ${businessContext.financial.incomeCount}
- Expense Transactions: ${businessContext.financial.expenseCount}
- Payment Methods: ${JSON.stringify(businessContext.financial.paymentMethods)}

TOP PRODUCTS:
${businessContext.topProducts.map((p, i) => `${i + 1}. ${p.name}: ${p.totalQuantitySold} sold, Rp ${parseFloat(p.totalRevenue).toLocaleString("id-ID")} revenue`).join("\n")}

INVENTORY STATUS:
- Total Products: ${businessContext.inventory.totalProducts}
- Low Stock Items: ${businessContext.inventory.lowStockCount}
- Out of Stock Items: ${businessContext.inventory.outOfStockCount}

PROFITABILITY:
- Total Revenue: Rp ${businessContext.profitability.totalRevenue.toLocaleString("id-ID")}
- Total Cost: Rp ${businessContext.profitability.totalCost.toLocaleString("id-ID")}
- Total Profit: Rp ${businessContext.profitability.totalProfit.toLocaleString("id-ID")}
- Profit Margin: ${businessContext.profitability.profitMargin}%

${userPrompt ? `USER REQUEST: ${userPrompt}` : ""}

Please provide:
1. Key Performance Insights (3-5 points)
2. Areas of Concern (if any)
3. Actionable Recommendations (3-5 specific actions)
4. Growth Opportunities

Format your response in a clear, structured manner using markdown.
`;

  return await gemini("gemini-3-flash-preview", prompt);
}

/**
 * Generate digestible summary from full AI insights
 * @param {string} fullInsights - Full AI insights text
 * @param {Object} metadata - Original business context metadata
 * @returns {Promise<Array>} Array of digestible insight cards
 */
async function generateDigestibleSummary(fullInsights, metadata, language = "English") {
  const prompt = `
As an ${language} expert business analyst AI you are tasked at summarizing business insights into actionable highlights.

Analyze the following comprehensive business insight and extract the MOST IMPORTANT 3-5 key points that a business owner needs to know immediately.

FULL INSIGHT:
${fullInsights}

BUSINESS CONTEXT:
- Profit Margin: ${metadata.profitability.profitMargin}%
- Net Profit: Rp ${(metadata.financial.totalIncome - metadata.financial.totalExpense).toLocaleString("id-ID")}
- Low Stock Items: ${metadata.inventory.lowStockCount}
- Out of Stock Items: ${metadata.inventory.outOfStockCount}

Generate a JSON response with 3-5 key insight cards. Each card should be:
1. Short and actionable (1-2 sentences max)
2. Categorized by type (financial, inventory, product, operations, growth)
3. Include a priority level (high, medium, low)
4. Include an icon suggestion for UI
5. Include a trend indicator (positive, negative, neutral, warning)

Return ONLY valid JSON in this exact format:
{
  "insights": [
    {
      "id": "1",
      "message": "Short actionable message here",
      "type": "financial",
      "priority": "high",
      "trend": "positive",
      "icon": "trending-up",
      "value": "25.5%",
      "action": "Specific action to take"
    }
  ]
}

Valid types: financial, inventory, product, operations, growth, alert
Valid priorities: high, medium, low
Valid trends: positive, negative, neutral, warning
Valid icons: trending-up, trending-down, alert-circle, package, dollar-sign, users, chart-bar, warning, check-circle

Focus on the MOST CRITICAL insights that require immediate attention or highlight significant achievements.

Make sure the user understands this are AI-generated summaries based on the full insights provided.
`;

  const response = await gemini("gemini-3-flash-preview", prompt);

  // Parse JSON from response
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse AI summary JSON:", error);
    // Return fallback structure
    return {
      insights: [
        {
          id: "1",
          message: "Unable to generate summary. Please check the full insights.",
          type: "alert",
          priority: "medium",
          trend: "neutral",
          icon: "alert-circle",
          value: null,
          action: "View full insights for details",
        },
      ],
    };
  }
}

module.exports = { test, gemini, analyzeBusinessData, generateDigestibleSummary };
