/* eslint-disable no-underscore-dangle */
const htmlSvgLogo = require('./svgLogo');

const generateHtmlHeader = () => {
  const htmlHeader = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/style.css">
    <title>Riigikogu</title>
  </head>
  <body>`;
  return htmlHeader;
};

const generateHtmlFooter = () => {
  const htmlFooter = `
  <footer>
    <p>Marten Elias, Riigikogu lehekülg 2024</p>
  </footer>
  </body>
  </html>`;
  return htmlFooter;
};

// Menüüriba kujundus
const generateHtmlNav = () => {
  const svgLogo = htmlSvgLogo.getSvgLogo();
  const htmlNav = `
  <nav>
    <div class="logo">
      ${svgLogo}
    </div>
    <div class="navList">
      <a class="navListElement" href="/">Pealeht</a>
      <a class="navListElement" href="/members">Liikmed</a>
      <a class="navListElement" href="/search">Otsi</a>
    </div>
  </nav>`;
  return htmlNav;
};

// Pealehe väljanägemine
const generateHtmlResponse = () => {
  const htmlHeader = generateHtmlHeader();
  const htmlFooter = generateHtmlFooter();
  const htmlNav = generateHtmlNav();
  const htmlContent = `
    <div class="response">
      <h1>Riigikogu</h1>
      <p>Sellel veebilehel on teil võimalik tutvuda Riigikogu liikmetega. Menüüribal on teil võimalik liikuda edasi liikmete lehele, kus on nimekiri kõikidest Riigikogu liikmetest. Liikmetega saab detailsemalt tutvuda nime peale klõpsates. Võimalik ka kommentaare lisada. Kui olete tutvunud omale sobiva inimesega aga ei leia teda üles, siis on menüüribal otsimise valik. Otsida saab nii nime kui ka fraktsiooni järgi.</p>
    </div>
  `;
  const html = `
    ${htmlHeader}
    ${htmlNav}
    ${htmlContent}
    ${htmlFooter}`;
  return html;
};

const generateCommentsList = (comments) => {
  let list = '<ol>';
  comments.forEach((comment) => {
    list += `
    <li>
      <p>Kommentaari sisu: ${comment.content}</p>
    </li>  
    `;
  });
  list += '</ol>';
  return list;
};

// Riigikogu liikmete lehekülje väljanäemine ja funktsioonid.
const generateHtmlMembersList = (members) => {
  const htmlHeader = generateHtmlHeader();
  const htmlFooter = generateHtmlFooter();
  const htmlNav = generateHtmlNav();
  let list = `
  <h1>Riigikogu liikmed</h1>
  <ul class="profile-list">`;
  // Kui on fraktsioon ja komitee olemas näitab sellist html'i
  // Näitab ainult esimest fraktsiooni ja komiteed
  members.forEach((member) => {
    if (member.factions.length > 0 && member.committees.length > 0) {
      const factionName = member.factions[0].name;
      const committeeName = member.committees[0].name;
      const photo = member.photo._links.download.href;
      list += `
        <li class="item">
          <div class="memberContainer">
            <div>
              <img src="${photo}" alt="small image" width="140" height="100">
            </div>
            <div class="smallDetails">
              <a href="/members/${member.uuid}"><h2 class="fullname">${member.fullName} &#129122;</h2></a>
              <h3>${factionName}</h3>
              <p>&#9993;${member.email}</p>
              <p>${committeeName}</p>
            </div>
          </div>
        </li>
      `;
    } else {
      // Kui ei ole komiteed ega fraktsiooni
      const photo = member.photo._links.download.href;
      list += `
        <li class="item">
          <div class="memberContainer">
            <div class="smallImage">
              <img src="${photo}" alt="small image" width="140" height="100">
            </div>
            <div class="smallDetails">
              <a href="/members/${member.uuid}"><h2 class="fullname">${member.fullName} &#129122;</h2></a>
              <p>&#9993;${member.email}</p>
            </div>
          </div>  
        </li>
      `;
    }
  });
  list += '</ul>';
  const html = `
    ${htmlHeader}
    ${htmlNav}
    ${list}
    ${htmlFooter}`;
  return html;
};

// Liikmete detailvaate kujundus
const generateHtmlDetail = (detail, comments = []) => {
  const htmlHeader = generateHtmlHeader();
  const htmlFooter = generateHtmlFooter();
  const htmlNav = generateHtmlNav();
  const factionName = detail.factions && detail.factions.length > 0
    ? detail.factions[0].name
    : 'Fraktsioon puudub';
  const committeeName = detail.committees && detail.committees.length > 0
    ? detail.committees[0].name
    : 'Komitee puudub';
  const photo = detail.photoBig ? detail.photoBig._links.download.href : 'default-image-url';
  const speeches = detail.lastSpeech || { title: 'No speeches available', text: '', _links: { self: { href: '#' } } };
  const details = `
  <h2 class="personHeader">${detail.fullName}</h2>
  <section>
    <article class="personDetails">
      <div class="line"></div>
      <div class="personInfo">${detail.introduction}</div>
      <div class="line"></div>
      <div class="election">
        <p>${factionName}</p>
        <p>${committeeName}</p>
        <p>Valimisringkond: ${detail.electoralDistrictHistory && detail.electoralDistrictHistory[0]
            ? detail.electoralDistrictHistory[0].electoralDistrict.value
            : 'Valimisringkond puudub'}</p>
      </div>
      <div class="emailPhoto">
        <p>${detail.phone || 'Telefon puudub'}</p>
        <p>${detail.email || 'Email puudub'}</p>
      </div>
      <details>
        <summary>Elulugu</summary>
        <div class="bio">${detail.biography || 'Elulugu puudub'}</div>
      </details>
    </article>
    <article class="personPhoto">
      <img src="${photo}" width="450" height="350">
    </article>
  </section>
  <div class="speechComment">
    <div class="speech">
      <h2>Sõnavõtud</h2>
      <h3>${speeches.title}</h3>
      <p>${speeches.text}</p>
      <a href="${speeches._links.self.href}">Loe edasi...</a>
    </div>
    <div class="commentsContainer">
      <div class="comments">
        <h2 class="commentsHeader">Kommentaarid</h2>
        ${generateCommentsList(comments)}
      </div>
      <form class="commentsForm" action="/comments" method="post">
      <input class="commentsInput" type="text" id="comment" name="content" placeholder="Sisesta kommentaar...">
      <input type="hidden" id="memberId" name="memberId" value="${detail.uuid}">
      <br>
      <input class="commentsBtn" type="submit" value="Lisa kommentaar">
      </form>
    </div>
  </div>`;
  const html = `
    ${htmlHeader}
    ${htmlNav}
    ${details}
    ${htmlFooter}`;
  return html;
};

// Otsingu funktsioon
// Väljastab liikme otsimise nime või fraktsiooni järgi
const getMembersBySearchTerm = (members, searchTerm, searchField) => {
  const result = members.filter((member) => {
    if (searchField === 'fullName') {
      return member.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    } if (searchField === 'factionName' && member.factions.length > 0) {
      return member.factions[0].name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });
  return result;
};

// Otsingu kujundus
const generateSearchHtml = () => {
  const htmlHeader = generateHtmlHeader();
  const htmlFooter = generateHtmlFooter();
  const htmlNav = generateHtmlNav();
  const forms = `
  <h1>Otsing:</h1> 
  <div class="searches">
    <form action="/search" method="GET" class="forms">
      <label for="searchTerm">Otsi nime järgi:</label><br>
      <input type="text" id="searchTerm" name="searchName" class="input" placeholder="Sisesta nimi..."><br>
      <button type="submit" class="button">Otsi &#129122;</button>
    </form>

    <form action="/search" method="GET" class="forms">
      <label for="searchFaction">Otsi fraktsiooni järgi:</label><br>
      <input type="text" id="searchFaction" name="searchFaction" class="input" placeholder="Sisesta fraktsioon..."><br>
      <button type="submit" class="button">Otsi &#129122;</button>
    </form>
  </div>
  `;
  const html = `
    ${htmlHeader}
    ${htmlNav}
    ${forms}
    ${htmlFooter}`;
  return html;
};

// Et teha app.js fail lühemaks, siis lisasin otsingu funktsioonid siia
// Kui otsing sisaldab numbrit või ei eksisteeri, annab veateate hüpikaknas
const handleSearch = async (dataService, searchName, searchFaction) => {
  if (searchName) {
    if (Number(searchName)) {
      return {
        message: '<script>alert(\'Otsing ei tohi sisaldada numbreid. Proovi uuesti.\');</script>',
        html: generateSearchHtml(),
      };
    }
    try {
      const members = await dataService.getData('api/plenary-members');
      const searchResults = getMembersBySearchTerm(members, searchName, 'fullName');
      if (searchResults.length === 0) {
        return {
          message: '<script>alert(\'Ei leitud ühtegi nime.\');</script>',
          html: generateSearchHtml(),
        };
      }
      const searchResultsHtml = generateHtmlMembersList(searchResults);
      return {
        html: searchResultsHtml,
      };
    } catch (error) {
      console.error('Tekkis error otsides nime järgi:', error);
      return {
        message: 'Server error!',
      };
    }
  }

  if (searchFaction) {
    if (Number(searchFaction)) {
      return {
        message: '<script>alert(\'Otsing ei tohi sisaldada numbreid. Proovi uuesti.\');</script>',
        html: generateSearchHtml(),
      };
    }
    try {
      const members = await dataService.getData('api/plenary-members');
      const searchResults = getMembersBySearchTerm(members, searchFaction, 'factionName');
      if (searchResults.length === 0) {
        return {
          message: '<script>alert(\'Ei leitud ühtegi erakonda.\');</script>',
          html: generateSearchHtml(),
        };
      }
      const searchResultsHtml = generateHtmlMembersList(searchResults);
      return {
        html: searchResultsHtml,
      };
    } catch (error) {
      console.error('Tekkis error otsides erakonna järgi:', error);
      return {
        message: 'Server error!',
      };
    }
  }
  return {
    html: generateSearchHtml(),
  };
};

module.exports = {
  generateHtmlResponse,
  generateHtmlMembersList,
  generateHtmlDetail,
  getMembersBySearchTerm,
  generateSearchHtml,
  handleSearch,
};
