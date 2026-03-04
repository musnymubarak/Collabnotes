const Note = require('../models/Note');
const User = require('../models/User');

exports.getNotes = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  const filter = {
    isDeleted: false,
    $or: [{ owner: userId }, { 'collaborators.user': userId }],
  };

  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort(search ? { score: { $meta: 'textScore' } } : { updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'username email')
      .populate('collaborators.user', 'username email'),
    Note.countDocuments(filter),
  ]);

  res.json({ notes, total, page: Number(page), pages: Math.ceil(total / limit) });
};

exports.getNoteById = async (req, res) => {
  await req.note.populate('owner', 'username email');
  await req.note.populate('collaborators.user', 'username email');
  res.json(req.note);
};

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const note = await Note.create({ title, content, owner: req.user._id });
  res.status(201).json(note);
};

exports.updateNote = async (req, res) => {
  const { title, content } = req.body;
  if (title !== undefined) req.note.title = title;
  if (content !== undefined) req.note.content = content;
  await req.note.save();
  res.json(req.note);
};

exports.deleteNote = async (req, res) => {
  if (!req.isOwner)
    return res.status(403).json({ message: 'Only the owner can delete this note' });
  req.note.isDeleted = true;
  await req.note.save();
  res.json({ message: 'Note deleted' });
};

exports.addCollaborator = async (req, res) => {
  if (!req.isOwner)
    return res.status(403).json({ message: 'Only the owner can manage collaborators' });

  const { email, role = 'viewer' } = req.body;
  const targetUser = await User.findOne({ email });
  if (!targetUser) return res.status(404).json({ message: 'User not found' });
  if (targetUser._id.equals(req.note.owner))
    return res.status(400).json({ message: 'Owner cannot be added as collaborator' });

  const exists = req.note.collaborators.find((c) => c.user.equals(targetUser._id));
  if (exists) return res.status(409).json({ message: 'Already a collaborator' });

  req.note.collaborators.push({ user: targetUser._id, role });
  await req.note.save();
  res.status(201).json(req.note);
};

exports.updateCollaborator = async (req, res) => {
  if (!req.isOwner)
    return res.status(403).json({ message: 'Only the owner can update roles' });

  const collab = req.note.collaborators.find((c) =>
    c.user.equals(req.params.userId)
  );
  if (!collab) return res.status(404).json({ message: 'Collaborator not found' });

  collab.role = req.body.role;
  await req.note.save();
  res.json(req.note);
};

exports.removeCollaborator = async (req, res) => {
  if (!req.isOwner)
    return res.status(403).json({ message: 'Only the owner can remove collaborators' });

  req.note.collaborators = req.note.collaborators.filter(
    (c) => !c.user.equals(req.params.userId)
  );
  await req.note.save();
  res.json(req.note);
};