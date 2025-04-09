// lib/report-prompts.ts

const ALLOWED_REPORT_TYPES = ['overview', 'inputs', 'sustainability'] as const;
export type ReportType = (typeof ALLOWED_REPORT_TYPES)[number];

export const allowedReportTypes = ALLOWED_REPORT_TYPES;

export function generatePrompt(reportType: ReportType, content: string) {
  const promptTemplates: Record<ReportType, { system: string; user: string }> = {
    overview: {
      system: `You are a senior development project analyst working for a multilateral development bank. Your task is to write a formal and structured Project Overview report, aligned with international development and climate finance standards.`,
      user: `Using the following extracted content from project documents:\n\n{content}\n\n
Generate a report titled: \"Project Overview\".

Structure the report with the following sections:

1. **Project Title**
   - Name of the operation and a clear identification of the project.

2. **Project Summary**
   - Describe the purpose of the project, key implementing institutions (e.g., IDB, local governments), and financing structure.
   - Include modality (e.g., Multiple Works), total budget, and breakdown of international and local contributions.

3. **Objectives**
   - Describe the general development objective of the project.
   - List specific objectives, using bullet points where needed:
     - e.g., improving housing, mobility, urban infrastructure, environmental quality, and institutional capacity.

4. **Climate and Sustainability**
   - Clearly state the operation’s alignment with the **Paris Agreement** (mitigation and adaptation).
   - Mention climate strategies integrated into the project design:
     - Public transport prioritization
     - Sustainable mobility (cycling, pedestrian infrastructure)
     - Nature-based solutions and resilience measures
   - Include Climate Finance eligibility (% if possible), with justification.
   - Include Green Finance eligibility, mentioning biodiversity, pollution reduction, or disaster risk management components.

5. **Expected Impacts**
   - Provide a concise bullet-point list of measurable impacts:
     - e.g., number of families benefiting, reduced emissions, improved infrastructure, economic benefits.

Use a formal tone, clear headers, and concise professional language suitable for inclusion in IDB or donor-facing documentation. Avoid excessive verbosity. Keep the format clean, and ensure consistency with sustainability-aligned reporting practices.

Close with a concluding statement summarizing the transformative potential of the project in its urban, environmental, and institutional dimensions.`
    },
    inputs: {
      system: `Act as a senior climate and urban development expert. Your role is to write detailed annex content for a Climate Change and Sustainability Report.`,
      user: `Using the following project documents and extracted content:\n\n{content}\n\n
Write a report titled: \"Inputs for Climate Change and Sustainability Annex\".
The report must include:

1. A disclaimer paragraph clarifying the illustrative purpose of the document and Ecofilia's role.
2. Project Title and Operation Number
3. Project Summary (purpose, location, budget, financiers)
4. Detailed sections with numbered headings:
  1. Introduction to climate change and sustainability aspects in the context of the operation
    - Climate Change Context in Brazil
    - Local Climate Change Challenges
    - Proposed project approach for climate integration
  2. Climate Change Adaptation
    - Alignment with NDC and National Adaptation Plan
    - Vulnerability context (climate hazards, exposure, vulnerability)
    - Application of Standard 4 of the ESPF
    - Conclusion of alignment with the adaptation goal of the Paris Agreement
  3. Climate Change Mitigation
    - Compatibility with NDC mitigation goals
    - GHG emission context and mitigation contributions
    - Classification of activities
    - Specific assessment of alignment with PA mitigation objective
    - Conclusion
  4. Climate Finance Approach
    - Mitigation finance eligible measures
    - Adaptation finance eligible measures
  5. Green Finance Approach
    - Urban biodiversity and environmental strategies
    - Circular economy and sustainable urban planning

The output should be formal, technical, and structured. Format sections with clear headers and avoid bullet points unless necessary. Use bold or ALL CAPS for section titles if needed.

Important: This report is not official nor final. It is intended to illustrate how Ecofilia can support sustainability screenings and reporting.

End with a clear and concise conclusion.`
    },
    sustainability: {
      system: `You are a sustainability and climate finance analyst specialized in multilateral development bank (MDB) criteria. Your task is to generate a Climate Change and Sustainability Filter report aligned with the IDB's Paris Agreement Assessment methodology.`,
      user: `Use the following project documents and extracted information:\n\n{content}\n\n
Generate a report titled: \"Climate Change and Sustainability Filter\".

The report must include the following structured sections:

1. **Disclaimer**
   - State that the document is illustrative, based on project data, and not a formal assessment or financial advice.
   - Mention Ecofilia's role as a support platform for sustainability screenings.

2. **Project Identification**
   - Title and number of the operation
   - Team leader (if applicable)
   - Investment lending category (choose from: Investment Loan / Policy-Based Loan / Results-Based Loan / GOM - Multiple Works)

3. **Universally Aligned Activities**
   - List and justify activities that fall under the \"universally aligned\" categories according to MDB/IDB alignment guidance.
   - Use categories such as AGRICULTURE, TRANSPORT, BUILDINGS, TECHNOLOGY, SERVICES.
   - If any category marked with an asterisk (*), include justification based on IDB guidance.

4. **Activities Requiring Specific Alignment Assessment**
   - Identify activities not automatically aligned that require further justification (e.g., road expansion).
   - List them and explain alignment risks and mitigation strategies.

5. **Paris Agreement Alignment Strategy**
   - For each non-automatically aligned activity, outline recommendations or project features that support alignment.
   - Include examples such as public transport prioritization, sustainable urban mobility plans, decarbonization roadmaps.

6. **Climate Finance Potential**
   - Indicate whether the operation includes climate finance-eligible components.
   - Justify based on MDB methodology (e.g., BRT studies, energy-efficient housing, reforestation, NbS).

7. **Green Finance Potential**
   - Assess whether the project contributes to green finance eligibility.
   - Include urban biodiversity, NbS, pollution reduction, environmental governance, and institutional capacity.

End the report with a **clear and neutral tone**, using structured formatting and professional language suitable for review by IDB, development banks, or climate finance institutions.

Format the report using numbered sections, avoid excessive use of bullet points, and maintain formal tone throughout.`
    }
  };

  const selected = promptTemplates[reportType];
  return {
    system: selected.system,
    user: selected.user.replace('{content}', content)
  };
}
