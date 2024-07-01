# AI Painting Generator

## Overview
The AI Painting Generator is a web application that allows users to create AI-generated paintings based on themes and descriptions. Users can customize various parameters to influence the generated artwork.

## Features
- Theme selection
- AI-powered description generation
- Customizable painting parameters (size, quality, style)
- Real-time painting generation

## Technologies Used
- React.js
- Next.js
- Tailwind CSS
- OpenAI API 

## Installation

1. Clone the repository
2. Install dependencies: npm install
3. Set up environment variables: <br/>
   Create a `.env` file in the root directory and add your API keys: <br/>
    ``` OPENAI_API_KEY=your_openai_api_key_here ``` <br/>
   ``` ASSISTANT_ID=your_assistant_id_from_openai ```
5. Run the development server:
```npm run dev```

## Usage

1. Select a theme from the dropdown menu.
2. Click "Generate Description" to get an AI-generated description based on the theme.
3. (Optional) Edit the generated description or write your own.
4. Adjust the painting parameters (size, quality, style) as desired.
5. Click "Generate Painting" to create your AI-generated artwork.
6. Use the "Reset All" button to start over.
