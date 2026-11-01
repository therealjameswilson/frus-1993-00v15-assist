(() => {
  const root = document.querySelector("[data-october-supplemental]");
  const data = window.FRUS_RESEARCH;
  if (!root || !data) return;
  const records = data.document_candidates.filter(r =>
    r.releaseBatch === "2026-10-30" &&
    r.caseNumber === "M-2017-11839" &&
    Array.isArray(r.searchableText)
  );
  const search = document.querySelector("#october-supplemental-search");
  const count = document.querySelector("#october-supplemental-count");
  const list = document.querySelector("#october-supplemental-list");
  const el = (tag, text) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; return n; };
  function makeCard(record) {
    const card = el("article"); card.style.cssText = "margin:1rem 0;padding:1rem;border:1px solid #d8dee8;border-radius:10px;background:#f8fafc";
    const title = el("h3"); const titleLink = el("a",record.title); titleLink.href=record.pdfUrl; titleLink.rel="noreferrer"; title.append(titleLink); card.append(title);
    card.append(el("p",record.reportingDateNote+" Case "+record.caseNumber+" · document "+record.documentId+" · "+record.pageCount+" physical PDF pages."));
    card.append(el("p",record.summary),el("p","Why this is relevant: "+record.relevance));
    const links=el("p","Official State PDF pages: ");
    record.pageLinks.forEach((p,i)=>{if(i)links.append(document.createTextNode(" · "));const a=el("a","p. "+p.page);a.href=p.url;a.rel="noreferrer";links.append(a);});
    card.append(links);
    const copy=el("button","Copy supported citation");copy.type="button";copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(record.copyCitation);copy.textContent="Citation copied";setTimeout(()=>copy.textContent="Copy supported citation",1200);}catch{window.prompt("Copy this citation",record.copyCitation);}});card.append(copy);
    const details=el("details");details.append(el("summary","Searchable extracted source text"));
    details.append(el("p",record.textNotice));
    record.searchableText.forEach(p=>{details.append(el("h4","Physical PDF page "+p.page));const pre=el("pre",p.text);pre.style.cssText="white-space:pre-wrap;max-height:28rem;overflow:auto;padding:.75rem;background:#fff;border:1px solid #e2e8f0;border-radius:6px";details.append(pre);});
    card.append(details,el("p","Compiler selection pending; searchable text may contain OCR errors and has not been checked against the source facsimile."));
    return card;
  }
  function render() {
    const q=(search?.value||"").trim().toLowerCase();
    const visible=records.filter(r=>!q||[r.title,r.summary,r.relevance,r.copyCitation,r.caseNumber,r.documentId,...r.searchableText.map(p=>p.text)].join(" ").toLowerCase().includes(q));
    list.replaceChildren(...visible.map(makeCard));
    count.textContent=visible.length+" of "+records.length+" cross-case leads shown. These do not change the separate M-2013-12509 review totals.";
  }
  search?.addEventListener("input",render); render();
})();
