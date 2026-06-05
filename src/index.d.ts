export interface QuiFlags {
  auto?: boolean;
  force?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  json?: boolean;
  all?: boolean;
  ci?: boolean;
  remove?: boolean;
  noInit?: boolean;
  help?: boolean;
  onError?: string;
  repo?: string;
  url?: string;
  targetPath?: string;
  connected?: string;
  ref?: string;
  baseBranch?: string;
  title?: string;
  routeBase?: string;
  routesPath?: string;
  templatePath?: string;
  output?: string;
  branch?: string;
  searchLevels?: string;
  [key: string]: string | boolean | undefined;
}

export interface QuiContext {
  cwd: string;
  flags: QuiFlags;
  positionals: string[];
  rawArgv: string[];
}

export interface QuiReportItem {
  action?: string;
  target?: string;
  status?: string;
  [key: string]: unknown;
}

export interface QuiReport {
  schemaVersion: string;
  command: string;
  ok: boolean;
  exitCode: number;
  repoSelector: string | null;
  targetPath: string | null;
  summary: Record<string, number>;
  items: QuiReportItem[];
  warnings: string[];
  errors: string[];
  footer: string[];
  timestamp: string;
  details?: unknown;
}

export const EXIT_CODES: Readonly<{
  SUCCESS: 0;
  UNEXPECTED_RUNTIME_ERROR: 1;
  USAGE_PARSER_ERROR: 2;
  CONFIG_SCHEMA_ERROR: 3;
  SOURCE_GIT_NETWORK_ERROR: 4;
  POLICY_FAIL_STOP: 5;
  USER_REJECTED_PLAN: 6;
  SCOPE_SAFETY_VIOLATION: 7;
  DEPENDENCY_INSTALL_ERROR: 8;
  VERIFY_DIFF_MISMATCH: 9;
}>;

export const REPORT_SCHEMA_VERSION: string;
export const CONFIG_SCHEMA_VERSION: string;

export function createContext(input: Partial<QuiContext> & Pick<QuiContext, "cwd">): QuiContext;
export function parseArgv(argv: string[]): {
  command: string;
  positionals: string[];
  flags: QuiFlags;
  raw: string[];
};
export function createReport(input: Partial<QuiReport> & Pick<QuiReport, "command">): QuiReport;
export function printReport(report: QuiReport, jsonMode?: boolean): void;

export function runCommand(command: string, context: QuiContext): Promise<QuiReport>;
export function runArgv(argv: string[], options?: { cwd?: string }): Promise<QuiReport>;

export function runInit(context: QuiContext): Promise<QuiReport>;
export function runConnect(context: QuiContext): Promise<QuiReport>;
export function runVerify(context: QuiContext): Promise<QuiReport>;
export function runDiff(context: QuiContext): Promise<QuiReport>;
export function runAdd(context: QuiContext): Promise<QuiReport>;
export function runList(context: QuiContext): Promise<QuiReport>;
export function runUpdate(context: QuiContext): Promise<QuiReport>;
export function runRemove(context: QuiContext): Promise<QuiReport>;
export function runGenerate(context: QuiContext): Promise<QuiReport>;
export function runGenerateDemo(context: QuiContext): Promise<QuiReport>;
export function runClone(context: QuiContext): Promise<QuiReport>;
export function runPush(context: QuiContext): Promise<QuiReport>;
export function runRoute(context: QuiContext): Promise<QuiReport>;
export function runTemplate(context: QuiContext): Promise<QuiReport>;
export function runInstall(context: QuiContext): Promise<QuiReport>;
export function runExport(context: QuiContext): Promise<QuiReport>;
export function runRegister(context: QuiContext): Promise<QuiReport>;
