const Note = require('../models/Note');

const requireAccess = (requiredRole = 'viewer') => async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.id, isDeleted: false });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  const isOwner = note.owner.equals(req.user._id);
  const collab = note.collaborators.find((c) => c.user.equals(req.user._id));

  if (!isOwner && !collab)
    return res.status(403).json({ message: 'Access denied' });

  if (requiredRole === 'owner' && !isOwner)
    return res.status(403).json({ message: 'Owner access required' });

  if (requiredRole === 'editor' && !isOwner && collab?.role !== 'editor')
    return res.status(403).json({ message: 'Editor access required' });

  req.note = note;
  req.isOwner = isOwner;
  next();
};

module.exports = requireAccess;
