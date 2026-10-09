import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

const config = defineCloudflareConfig({
	// For best results consider enabling R2 caching
	// See https://opennext.js.org/cloudflare/caching for more details
	// incrementalCache: r2IncrementalCache
});

// Our "build" npm script runs the full OpenNext build chain (`opennextjs-cloudflare
// build`), which by default re-invokes "npm run build" to produce the underlying
// Next.js build — that would recurse into itself. Call `next build` directly instead.
config.buildCommand = "npx next build";

export default config;
