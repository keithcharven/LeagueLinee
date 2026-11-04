import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, UserRound } from 'lucide-react';
import { addPlayer, getLeagues, getMyRoster, registerTeam, removePlayer } from '../../services/leagueService.js';
import { useImagePreview } from '../../hooks/useImagePreview.js';
import { ImagePicker, PageHeader, Spinner, Empty } from '../../components/ui.jsx';

const ROLES = ['Jungler', 'Roamer', 'Mid Lane', 'Gold Lane', 'EXP Lane', 'Duelist', 'Controller', 'Sentinel', 'Carry', 'Support'];

function TeamForm() {
  const [name, setName] = useState('Tigers Esports');
  const [leagueId, setLeagueId] = useState('');
  const [logo, logoUrl, setLogo] = useImagePreview();
  const { data: leagues } = useQuery({ queryKey: ['leagues', 'All'], queryFn: () => getLeagues('All') });
  const open = leagues?.filter((l) => l.status === 'REGISTRATION_OPEN') ?? [];
  const m = useMutation({ mutationFn: registerTeam });

  return (
    <form className="panel space-y-4 p-5" onSubmit={(e) => { e.preventDefault(); m.mutate({ name, leagueId, logo }); }}>
      <h2 className="text-lg">Team registration</h2>
      <div><label className="label" htmlFor="tn">Team name</label><input id="tn" className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div>
        <label className="label" htmlFor="lg">League season</label>
        <select id="lg" className="input" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} required>
          <option value="">Choose a league with open registration</option>
          {open.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.game})</option>)}
        </select>
      </div>
      <ImagePicker label="Team logo" preview={logoUrl} onFile={setLogo} />
      <button className="btn-primary" disabled={m.isPending}>{m.isPending ? 'Submitting…' : 'Submit registration'}</button>
      {m.isSuccess && <p className="text-sm text-emerald-300" role="status">Registration sent. The organizer will review it.</p>}
      {m.isError && <p className="text-sm text-red-300" role="alert">Could not submit. Check the details and try again.</p>}
    </form>
  );
}

function PlayerForm() {
  const qc = useQueryClient();
  const [f, setF] = useState({ ign: '', realName: '', role: ROLES[0] });
  const [photo, photoUrl, setPhoto] = useImagePreview();
  const m = useMutation({
    mutationFn: () => addPlayer({ ...f, photo, photoPreview: photoUrl }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roster'] }); setF({ ign: '', realName: '', role: ROLES[0] }); setPhoto(null); },
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <form className="panel space-y-4 p-5" onSubmit={(e) => { e.preventDefault(); m.mutate(); }}>
      <h2 className="text-lg">Add a player</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="ign">In-game name</label><input id="ign" className="input" value={f.ign} onChange={set('ign')} required /></div>
        <div><label className="label" htmlFor="rn">Real name</label><input id="rn" className="input" value={f.realName} onChange={set('realName')} required /></div>
      </div>
      <div>
        <label className="label" htmlFor="role">Role</label>
        <select id="role" className="input" value={f.role} onChange={set('role')}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
      </div>
      <ImagePicker label="Player photo" preview={photoUrl} onFile={setPhoto} round />
      <button className="btn-primary" disabled={m.isPending}>{m.isPending ? 'Adding…' : 'Add to roster'}</button>
    </form>
  );
}

export default function RosterPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['roster'], queryFn: getMyRoster });
  const del = useMutation({ mutationFn: removePlayer, onSuccess: () => qc.invalidateQueries({ queryKey: ['roster'] }) });

  return (
    <>
      <PageHeader title="Team & roster" />
      <div className="grid gap-6 lg:grid-cols-2"><TeamForm /><PlayerForm /></div>
      <h2 className="mb-3 mt-8 text-lg">Current roster</h2>
      {isLoading ? <Spinner /> : !data?.length ? (
        <div className="panel"><Empty title="No players yet" hint="Add at least your starting lineup before the registration deadline." /></div>
      ) : (
        <ul className="panel divide-y divide-ink-700">
          {data.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-ink-800 text-ink-500">
                {p.photo ? <img src={p.photo} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-4 w-4" />}
              </span>
              <div className="flex-1"><p className="font-medium text-white">{p.ign}</p><p className="text-sm text-ink-500">{p.realName} · {p.role}</p></div>
              <button className="btn-danger px-2 py-1" aria-label={`Remove ${p.ign}`} onClick={() => del.mutate(p.id)}><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
