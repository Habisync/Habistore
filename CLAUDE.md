# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Known Issues
- This project has React hook error issues with mismatched React versions
- Multiple React versions exist (React 18.2.0 in Shopify CLI vs React 18.3.1 in main app)
- Fix by using `npm install --legacy-peer-deps` and ensuring consistent React versions

## Build Commands
- `npm run dev` - Start development server with codegen (may be unstable)
- `npm run dev:remix` - Start Remix dev server with server.ts
- `npm run dev:oxygen` - Start hydrogen development server without codegen
- `npm run dev:fixed` - Start hydrogen dev server on alternate port 3001
- `npm run dev:alt` - Start development server with debugging enabled
- `npm run dev:debug` - Start development server with Node inspector
- `npm run dev:vite` - Start Vite directly on port 4000 (most reliable)
- `npm run build` - Build with Vite
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run e2e` - Run Playwright E2E tests
- `npm run e2e:ui` - Run Playwright tests with UI
- `npx playwright test tests/file.test.ts` - Run specific test file

## Code Style
- Use TypeScript with strict type checking
- Format code with Prettier following @shopify/prettier-config
- Follow ESLint rules from @remix-run/eslint-config and plugin:hydrogen
- Import order: builtin → external → internal → parent → sibling with newlines between
- Use absolute imports for app files with ~/ prefix
- Follow React functional component patterns with hooks
- Use Tailwind CSS for styling
- Handle errors with proper type checking and error boundaries