import fs from 'fs';
import glob from 'glob';
import { processFile as parseToJSON } from 'md-yaml-json';
import moment from 'moment';
import path from 'path';
import { sortCollection } from './sortCollection';

const parseHtmlAnchors = html => html.split('<a href="http').join('<a target="_blank" href="http');

export function getJsonData() {
   const now = new Date();
   let jsonData = {};

   fs.readdirSync('src/html/_data/').forEach(jsonFile => {
      const thisData = JSON.parse(fs.readFileSync(`src/html/_data/${ jsonFile }`));
      jsonData = Object.assign({}, jsonData, thisData);
   });

   jsonData.copyYear = now.getFullYear();

   jsonData.posts = {
      annoucements: [],
      sections: {}
   };

   const annoucements = [];
   const annoucementFiles =  glob.sync("_posts/annoucements/**/*.md", {});

   annoucementFiles.forEach(file => {
      const annoucementData = parseToJSON(path.resolve(__dirname, `../../${ file }`), {
         tables: false,
         breaks: false,
         pedantic: false,
         sanitize: false
      });

      const annoucement = {
         title: annoucementData.meta.title,
         date: annoucementData.meta.date,
         dateStr: moment(annoucementData.meta.date).format('MMM. D, YYYY'),
         birthtime: annoucementData.meta.birthtime,
         content: parseHtmlAnchors(annoucementData.html),
      };

      annoucements.push(annoucement);
   });

   jsonData.posts.annoucements = sortCollection(annoucements, ['date', 'birthtime']).reverse();

   const sectionFiles =  glob.sync("_posts/sections/**/*.md", {});

   sectionFiles.forEach(file => {
      const secctionData = parseToJSON(path.resolve(__dirname, `../../${ file }`), {
         tables: false,
         breaks: false,
         pedantic: false,
         sanitize: false
      });

      const sectionContent = {
         title: secctionData.meta.title,
         page: secctionData.meta.page,
         key: secctionData.meta.key,
         content: parseHtmlAnchors(secctionData.html),
      };

      if (jsonData.posts.sections.hasOwnProperty(sectionContent.page) === false) {
         jsonData.posts.sections[sectionContent.page] = {};
      }

      jsonData.posts.sections[sectionContent.page][sectionContent.key] = sectionContent;
   });

   console.log(JSON.stringify(jsonData));

   return jsonData;
}

export default getJsonData;
