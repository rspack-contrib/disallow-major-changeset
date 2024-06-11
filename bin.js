#!/usr/bin/env node
import { run } from "./dist";

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
