const router = require('express').Router();
const protect = require('../middleware/auth.middleware');
const requireAccess = require('../middleware/noteAccess.middleware');
const ctrl = require('../controllers/notes.controller');

router.use(protect);

router.get('/', ctrl.getNotes);
router.post('/', ctrl.createNote);
router.get('/:id', requireAccess('viewer'), ctrl.getNoteById);
router.put('/:id', requireAccess('editor'), ctrl.updateNote);
router.delete('/:id', requireAccess('viewer'), ctrl.deleteNote);

router.post('/:id/collaborators', requireAccess('viewer'), ctrl.addCollaborator);
router.put('/:id/collaborators/:userId', requireAccess('viewer'), ctrl.updateCollaborator);
router.delete('/:id/collaborators/:userId', requireAccess('viewer'), ctrl.removeCollaborator);

module.exports = router;