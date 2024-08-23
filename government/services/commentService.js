const fs = require('fs');

const commentsFile = 'comments.json';

const writeComments = async (comments) => {
  try {
    fs.writeFileSync(commentsFile, JSON.stringify(comments));
    return true;
  } catch (error) {
    console.log('Viga faili kirjutamisel');
    return false;
  }
};

const readComments = async () => {
  try {
    const comments = fs.readFileSync(commentsFile, 'utf8');
    return JSON.parse(comments) || [];
  } catch (error) {
    console.log('Tekkis viga faili lugemisel');
    return [];
  }
};

const addComment = async (comment) => {
  let comments = await readComments();
  if (!comments) comments = [];
  comments.push(comment);
  const result = writeComments(comments);
  if (!result) return false;
  return true;
};

const getCommentsByMemberId = async (memberId) => {
  const comments = await readComments();
  const commentsByMemberId = comments.filter((comment) => comment.memberId === memberId);
  if (!commentsByMemberId) return [];
  return commentsByMemberId;
};

module.exports = {
  addComment,
  readComments,
  getCommentsByMemberId,
};
