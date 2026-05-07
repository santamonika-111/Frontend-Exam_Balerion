# Setup Instructions

## Prerequisites

Make sure you have the following installed:
- Node.js 16+ (LTS recommended)
- npm 8+ or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- react@^18.2.0
- react-dom@^18.2.0
- typescript@^5.3.3
- vite@^5.0.0
- tailwindcss@^3.3.5
- And other build tools...

### 2. Start Development Server

```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory

## Troubleshooting

### Issue: npm install fails
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Try install again: `npm install`

### Issue: Port 3000 already in use
Edit `vite.config.ts` to use a different port:
```typescript
server: {
  port: 3001,  // Change to another port
  open: true
}
```

### Issue: TypeScript errors
- Check `tsconfig.json` is correctly configured
- Run `npx tsc --noEmit` to check compilation
- Update TypeScript: `npm install -g typescript@latest`

## Development Tips

### Hot Module Replacement (HMR)
- Changes to `.tsx` and `.css` files will auto-refresh
- State is preserved during reloads

### TypeScript Strict Mode
- Strict type checking is enabled in `tsconfig.json`
- All types must be explicit
- This helps catch errors early

### Tailwind CSS
- Styles are defined inline using utility classes
- Add custom colors in `tailwind.config.js`
- PostCSS processes styles automatically

## Project Features

- 5,000+ orders displayed efficiently
- Manual & automatic allocation
- FIFO + Priority-based algorithms
- Real-time statistics
- Advanced filtering and sorting
- Responsive design
- TypeScript type safety
- Fast development with Vite

## Next Steps

1. **Explore the code**: Check out the component structure in `src/components/`
2. **Understand the algorithms**: Review `src/services/allocationService.ts`
3. **Customize mock data**: Edit `src/utils/mockData.ts`
4. **Connect to backend**: Replace mock data with API calls
5. **Deploy**: Use `npm run build` for production

## Support

For issues:
1. Check the README.md for detailed documentation
2. Review code comments in service files
3. Check browser console for errors
4. Verify all dependencies are installed: `npm list`

---
