from pathlib import Path

path = Path('src/App.tsx')
source = path.read_text()
old = '''        <a href="https://forge-crm-six.vercel.app" className="suite-link"><span>CRM</span><ChevronRight size={14} /></a>
        <a href="https://robquotes.vercel.app" className="suite-link"><span>Reader</span><ChevronRight size={14} /></a>
        <a href="https://forge-scope.vercel.app" className="suite-link"><span>Scope</span><ChevronRight size={14} /></a>
        <a href="https://lumber-estimator-ai.vercel.app" className="suite-link"><span>Quote / AI Quoter</span><ChevronRight size={14} /></a>
        <div className="suite-link active"><span>Manufacturing</span><span className="active-dot" /></div>'''
new = '''        <a href="https://forge2-navy.vercel.app" className="suite-link"><span>Home</span><ChevronRight size={14} /></a>
        <a href="https://forge-crm-six.vercel.app" className="suite-link"><span>CRM</span><ChevronRight size={14} /></a>
        <a href="https://robquotes.vercel.app" className="suite-link"><span>Reader</span><ChevronRight size={14} /></a>
        <a href="https://forge-scope.vercel.app" className="suite-link"><span>Scope</span><ChevronRight size={14} /></a>
        <a href="https://lumber-estimator-ai.vercel.app" className="suite-link"><span>Quote / AI Quoter</span><ChevronRight size={14} /></a>
        <div className="suite-link active"><span>Manufacturing</span><span className="active-dot" /></div>
        <a href="https://forge-portal-pi.vercel.app" className="suite-link"><span>Portal</span><ChevronRight size={14} /></a>'''
count = source.count(old)
if count != 1:
    raise SystemExit(f'Expected one Manufacturing suite nav block, found {count}')
path.write_text(source.replace(old, new))
