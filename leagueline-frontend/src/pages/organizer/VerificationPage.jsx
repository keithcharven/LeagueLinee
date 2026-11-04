import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { getPendingResults, publishResult } from '../../services/leagueService.js';
import { Badge, Empty, PageHeader, Spinner, fmtDate } from '../../components/ui.jsx';

function VerifyModal({ item, onClose }) {
  const qc = useQueryClient();
  const [gameIdx, setGameIdx] = useState(0);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [players, setPlayers] = useState(item.players);
  const m = useMutation({
    mutationFn: () => publishResult(item.id, { homeScore: score.home, awayScore: score.away, players }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pending-results'] }); qc.invalidateQueries({ queryKey: ['standings'] }); onClose(); },
  });
  const edit = (i, k, v) => setPlayers(players.map((p, j) => (j === i ? { ...p, [k]: Number(v) } : p)));
  const game = item.games[gameIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Verify result">
      <div className="panel my-8 w-full max-w-5xl">
        <div className="flex items-center justify-between border-b border-ink-700 p-4">
          <div>
            <h2 className="text-lg">{item.home} vs {item.away}</h2>
            <p className="text-sm text-ink-500">{item.league} · {item.format} · sent by {item.submittedBy}</p>
          </div>
          <button aria-label="Close" onClick={onClose}><X /></button>
        </div>

        <div className="grid gap-6 p-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex gap-2">
              {item.games.map((g, i) => (
                <button key={g.n} onClick={() => setGameIdx(i)} className={`rounded px-3 py-1 text-sm ${i === gameIdx ? 'bg-volt text-ink-950' : 'border border-ink-700'}`}>Game {g.n}</button>
              ))}
            </div>
            <img src={game.screenshot} alt={`Game ${game.n} proof`} className="w-full rounded-md border border-ink-700" />
          </div>

          <div className="space-y-5">
            <div>
              <p className="label">Official series score</p>
              <div className="flex items-center gap-3">
                <span className="w-32 truncate text-sm text-white">{item.home}</span>
                <input type="number" min="0" aria-label={`${item.home} score`} className="input w-20" value={score.home} onChange={(e) => setScore({ ...score, home: Number(e.target.value) })} />
                <span className="text-ink-500">-</span>
                <input type="number" min="0" aria-label={`${item.away} score`} className="input w-20" value={score.away} onChange={(e) => setScore({ ...score, away: Number(e.target.value) })} />
                <span className="w-32 truncate text-sm text-white">{item.away}</span>
              </div>
            </div>
            <div>
              <p className="label">Player K/D/A (check against the screenshot)</p>
              <div className="space-y-2">
                {players.map((p, i) => (
                  <div key={p.ign} className="flex items-center gap-2">
                    <span className="w-24 truncate text-sm text-white">{p.ign}</span>
                    {['k', 'd', 'a'].map((k) => (
                      <input key={k} type="number" min="0" aria-label={`${p.ign} ${k.toUpperCase()}`} className="input w-20" value={p[k]} onChange={(e) => edit(i, k, e.target.value)} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink-700 p-4">
          {m.isError && <p className="mr-auto text-sm text-red-300" role="alert">Could not publish. Try again.</p>}
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={m.isPending} onClick={() => m.mutate()}>{m.isPending ? 'Publishing…' : 'Publish result'}</button>
        </div>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  const { data, isLoading } = useQuery({ queryKey: ['pending-results'], queryFn: getPendingResults });
  const [active, setActive] = useState(null);

  return (
    <>
      <PageHeader title="Result verification" />
      {isLoading ? <Spinner /> : !data?.length ? (
        <div className="panel"><Empty title="Nothing to verify" hint="Results submitted by team managers will show up here." /></div>
      ) : (
        <ul className="panel divide-y divide-ink-700">
          {data.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-white">{r.home} vs {r.away}</p>
                <p className="text-sm text-ink-500">{r.league} · {r.games.length} screenshot{r.games.length > 1 ? 's' : ''} · {fmtDate(r.submittedAt)}</p>
              </div>
              <div className="flex items-center gap-3"><Badge status="PENDING" /><button className="btn-primary" onClick={() => setActive(r)}>Review</button></div>
            </li>
          ))}
        </ul>
      )}
      {active && <VerifyModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}
