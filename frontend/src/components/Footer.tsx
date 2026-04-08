import { Zap } from 'lucide-react';
import { NetworkBadge } from './NetworkBadge';

const EXPLORER_URL = 'https://explorer.hiro.so';
const DOCS_URL = 'https://docs.stacks.co';
const GITHUB_URL = 'https://github.com/stacks-network';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-sm mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3 text-primary" />
          <span>StackPulse v1.0.0-beta</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">On-chain micro-tipping protocol</span>
        </div>
        <div className="flex items-center gap-4">
          <NetworkBadge />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Docs</a>
            <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Explorer</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
