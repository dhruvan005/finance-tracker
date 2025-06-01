This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Testing

This project supports testing with both Bun and Jest.

### Testing with Bun

The project is primarily set up to use Bun for testing, which provides faster test execution. Tests follow Bun's test naming conventions (with `.test.ts` or `.spec.ts` extensions).

```bash
# Run all tests with Bun
bun test

# Run tests in watch mode
bun test:watch

# Run only expense API tests
bun test:expense
```

### Testing with Jest

For compatibility with certain libraries or specific test features, Jest is also supported:

```bash
# Run all tests with Jest
bun test:jest
```

#### Jest vs Bun Testing

- **Bun Tests**: Faster execution, built-in mocking with `mock.module()`
- **Jest Tests**: More mature ecosystem, better compatibility with certain libraries

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
