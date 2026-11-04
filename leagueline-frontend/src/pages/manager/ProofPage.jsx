import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getMyMatches, getMyRoster, submitProof } from '../../services/leagueService.js';
import { useImagePreview } from '../../hooks/useImagePreview.js';
import { Empty, ImagePicker, PageHeader, Spinner, fmtDate } from '../../components/ui.jsx';

export default function ProofPage() {
  const { data: matches, isLoading } = useQuery({ queryKey: ['my-matches'], queryFn: getMyMatches });
  const { data: roster = [] } = useQuery({ queryKey: ['roster'], queryFn: getMyRoster });
  const [matchId, setMatchId] = useState('');
  const [gameNo, setGameNo] = useState(1);
  const [shot, shotUrl, setShot] = useImagePreview();
  const [stats, setStats] = useState({});
  const m = useMutation({
    mutationFn: () => submitProof({ matchId, gameNo, screenshot: shot, stats: roster.map((p) => ({ playerId: p.id, ...(stats[p.id] || {}) })) }),
  });
  const setStat = (id, k, v) => setStats({ ...stats, [id]: { ...stats[id], [k]: Number(v) } });

  if (isLoading) return <Spinner />;
  return (
    <>
      <PageHeader title="Submit result proof" />
      {!matches?.length ? <div className="panel"><Empty title="No matches to report" hint="Matches show here once the organizer schedules them." /></div> : (
        <form className="panel space-y-5 p-5" onSubmit={(e) => { e.preventDefault(); m.mutate(); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="mt">Match</label>
              <select id="mt" className="input" value={matchId} onChange={(e) => setMatchId(e.target.value)} required>
                <option value="">Choose a match</option>
                {matches.map((x) => <option key={x.id} value={x.id}>{x.home} vs {x.away} · {fmtDate(x.at)}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="gn">Game in the series</label>
              <select id="gn" className="input" value={gameNo} onChange={(e) => setGameNo(Number(e.target.value))}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Game {n}</option>)}</select>
            </div>
          </div>
          <div>
            <ImagePicker label="Result screenshot" preview={shotUrl} onFile={setShot} />
            {shotUrl && <img src={shotUrl} alt="Screenshot preview" className="mt-3 max-h-64 rounded-md border border-ink-700" />}
          </div>
          <fieldset>
            <legend className="label">Player K/D/A (optional)</legend>
            <div className="space-y-2">
              {roster.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="w-28 truncate text-sm text-white">{p.ign}</span>
                  {['k', 'd', 'a'].map((k) => (
                    <input key={k} type="number" min="0" aria-label={`${p.ign} ${k.toUpperCase()}`} placeholder={k.toUpperCase()} className="input w-20" onChange={(e) => setStat(p.id, k, e.target.value)} />
                  ))}
                </div>
              ))}
            </div>
          </fieldset>
          <button className="btn-primary" disabled={m.isPending || !shot}>{m.isPending ? 'Uploading…' : 'Send proof to organizer'}</button>
          {m.isSuccess && <p className="text-sm text-emerald-300" role="status">Proof sent. You will get an email once the result is published.</p>}
          {m.isError && <p className="text-sm text-red-300" role="alert">Upload failed. Try a smaller image.</p>}
        </form>
      )}
    </>
  );
}
