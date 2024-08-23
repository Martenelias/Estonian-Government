const express = require('express');
const path = require('path');
const dataService = require('./services/dataService');
const htmlService = require('./services/htmlService');
const commentService = require('./services/commentService');

const port = 3000;
const app = express();
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const html = htmlService.generateHtmlResponse();
  res.send(html);
});

 app.get('/members', async (req, res) => {
  const members = await dataService.getData('api/plenary-members');
  if (!members) {
    return res.send('Server error!');
  }
  const membersList = htmlService.generateHtmlMembersList(members);
  return res.send(membersList);
});

app.get('/members/:id', async (req, res) => {
  const uuid = req.params.id;
  const detail = await dataService.getData(`api/plenary-members/${uuid}`);
  if (!detail) {
    return res.send('Server error!');
  }
  const comments = await commentService.getCommentsByMemberId(uuid);
  const detailHtml = htmlService.generateHtmlDetail(detail, comments);
  return res.send(detailHtml);
});

app.post('/comments', async (req, res) => {
  const { content, memberId } = req.body;
  const comment = {
    content,
    memberId,
  };
  const result = await commentService.addComment(comment);
  if (!result) return res.send('Midagi juhtus kommentaari salvestamisel');
  return res.redirect(`/members/${memberId}`);
});

app.get('/search', async (req, res) => {
  const { searchName, searchFaction } = req.query;

  const { message, html } = await htmlService.handleSearch(dataService, searchName, searchFaction);

  if (message) {
    return res.send(message + html);
  }

  return res.send(html);
});

app.listen(port, () => {
  console.log('Server is running!');
});
