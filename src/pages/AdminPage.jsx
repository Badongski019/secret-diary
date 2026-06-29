// src/pages/AdminPage.jsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, LogOut, Eye, X, Upload, Check, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getLetters, createLetter, updateLetter, deleteLetter, uploadFile } from '../lib/letters';
import { useAuth } from '../lib/AuthContext';

// ── File upload row ──────────────────────────────────────────────────────────
function FileUploadRow({ label, accept, storagePrefix, value, onChange }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `${storagePrefix}/${Date.now()}_${file.name}`;
      const url  = await uploadFile(file, path, setProgress);
      onChange(url, file.name);
      toast.success('Uploaded! ✨');
    } catch {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <label className="block text-xs font-sans text-dusty mb-1">{label}</label>
      <div className="flex gap-2 items-center">
        <button type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-rose/40 bg-white/60 text-sm font-sans text-wine hover:border-petal-300 transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? `${progress ?? 0}%` : 'Choose file'}
        </button>
        {value && <Check size={16} className="text-green-500" />}
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleFile} />
      </div>
      {value && (
        <p className="text-xs text-dusty mt-1 truncate max-w-xs">{value.split('/').pop().split('?')[0]}</p>
      )}
    </div>
  );
}

// ── Letter form modal ────────────────────────────────────────────────────────
function LetterModal({ editing, onClose, onSave }) {
  const [form, setForm] = useState({
    title:     editing?.title     || '',
    content:   editing?.content   || '',
    date:      editing?.date      || format(new Date(), 'yyyy-MM-dd'),
    image:     editing?.image     || '',
    music:     editing?.music     || '',
    musicTitle: editing?.musicTitle || '',
  });
  const [saving, setSaving] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSave() {
    if (!form.title || !form.content) { toast.error('Title and content required.'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateLetter(editing.id, form);
        toast.success('Letter updated! 💌');
      } else {
        await createLetter(form);
        toast.success('Letter created! 💌');
      }
      onSave();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 32, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 16, scale: 0.96 }}
        className="w-full max-w-xl glass rounded-3xl shadow-envelope border border-rose/30 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose/20">
          <h2 className="font-serif text-lg text-wine font-semibold">
            {editing ? 'Edit Letter' : 'New Letter'} 💌
          </h2>
          <button onClick={onClose} className="text-dusty hover:text-wine p-1 rounded-lg hover:bg-rose/20 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-sans text-dusty mb-1">Title *</label>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="My dearest…"
              className="w-full px-4 py-2.5 rounded-xl border border-rose/40 bg-white/70 font-serif text-wine placeholder:text-dusty/40 focus:ring-2 focus:ring-petal-300 transition-all"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-sans text-dusty mb-1">Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-rose/40 bg-white/70 font-sans text-wine focus:ring-2 focus:ring-petal-300 transition-all"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-sans text-dusty mb-1">Letter content *</label>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={8}
              placeholder="Write your heart out…"
              className="w-full px-4 py-3 rounded-xl border border-rose/40 bg-white/70 font-sans text-wine placeholder:text-dusty/40 focus:ring-2 focus:ring-petal-300 resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Image upload */}
          <FileUploadRow
            label="Photo (optional)"
            accept="image/*"
            storagePrefix="images"
            value={form.image}
            onChange={(url) => set('image', url)}
          />

          {/* Music upload */}
          <FileUploadRow
            label="Music (optional)"
            accept="audio/*"
            storagePrefix="music"
            value={form.music}
            onChange={(url) => set('music', url)}
          />
          {form.music && (
            <input
              value={form.musicTitle}
              onChange={(e) => set('musicTitle', e.target.value)}
              placeholder="Song title…"
              className="w-full px-4 py-2.5 rounded-xl border border-rose/40 bg-white/70 font-sans text-wine placeholder:text-dusty/40 focus:ring-2 focus:ring-petal-300 transition-all text-sm"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-rose/20 flex gap-3 justify-end">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-sans text-sm text-dusty border border-rose/30 hover:bg-rose/10 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 rounded-xl font-sans text-sm text-white font-medium bg-gradient-to-r from-petal-400 to-petal-600 shadow-petal hover:shadow-envelope disabled:opacity-50 transition-all flex items-center gap-2">
            {saving ? <Loader2 size={15} className="animate-spin" /> : null}
            {saving ? 'Saving…' : 'Save letter'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main admin page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [letters, setLetters]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal,   setModal]     = useState(null); // null | 'create' | letter obj
  const [deleting, setDeleting] = useState(null);

  async function loadLetters() {
    setLoading(true);
    try { setLetters(await getLetters()); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadLetters(); }, []);

  async function handleDelete(letter) {
    if (!confirm(`Delete "${letter.title}"?`)) return;
    setDeleting(letter.id);
    try {
      await deleteLetter(letter.id, letter.image, letter.music);
      toast.success('Deleted.');
      setLetters((l) => l.filter((x) => x.id !== letter.id));
    } catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  }

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen romantic-bg">
      {/* Header */}
      <header className="glass border-b border-rose/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-petal-500" />
          <h1 className="font-serif text-lg text-wine font-semibold">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-sans text-dusty hover:text-wine border border-rose/30 hover:bg-rose/10 transition-all">
            <Eye size={15} /> View diary
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-sans text-dusty hover:text-wine border border-rose/30 hover:bg-rose/10 transition-all">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total letters', value: letters.length, emoji: '💌' },
            { label: 'With music',    value: letters.filter(l => l.music).length, emoji: '🎵' },
            { label: 'With photos',   value: letters.filter(l => l.image).length, emoji: '🖼️' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 border border-rose/20 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="font-serif text-2xl text-wine font-bold">{s.value}</div>
              <div className="font-sans text-xs text-dusty">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Create button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base text-wine">All Letters</h2>
          <button
            onClick={() => setModal('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium text-white bg-gradient-to-r from-petal-400 to-petal-600 shadow-petal hover:shadow-envelope transition-all"
          >
            <Plus size={16} /> New letter
          </button>
        </div>

        {/* Letter list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl shimmer" />)}
          </div>
        ) : letters.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-script text-xl text-dusty">No letters yet — create the first one!</p>
          </div>
        ) : (
          <motion.div className="space-y-3" initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
            {letters.map((letter) => (
              <motion.div key={letter.id}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                className="glass rounded-2xl border border-rose/20 p-4 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-petal-100 flex items-center justify-center">
                  {letter.image
                    ? <img src={letter.image} alt="" className="w-full h-full object-cover" />
                    : <span className="text-2xl">💌</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm font-semibold text-wine truncate">{letter.title}</p>
                  <p className="font-sans text-xs text-dusty mt-0.5">
                    {letter.date ? format(new Date(letter.date), 'MMM d, yyyy') : '—'}
                    {letter.music && ' · 🎵'}
                    {letter.image && ' · 🖼️'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/letter/${letter.id}`)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-dusty hover:text-wine hover:bg-rose/20 transition-all"
                    title="Preview"
                  ><Eye size={15} /></button>
                  <button
                    onClick={() => setModal(letter)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-dusty hover:text-wine hover:bg-rose/20 transition-all"
                    title="Edit"
                  ><Pencil size={15} /></button>
                  <button
                    onClick={() => handleDelete(letter)}
                    disabled={deleting === letter.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-dusty hover:text-petal-500 hover:bg-petal-50 transition-all disabled:opacity-40"
                    title="Delete"
                  >
                    {deleting === letter.id
                      ? <Loader2 size={15} className="animate-spin" />
                      : <Trash2 size={15} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <LetterModal
            editing={modal === 'create' ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); loadLetters(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
