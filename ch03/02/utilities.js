"use strict";

const urlParse = require('url').parse;
const urlResolve = require('url').resolve;
const slug = require('slug');
const path = require('path');
const cheerio = require('cheerio');

module.exports.urlToFilename = (url) => {

    const pasredUrl = urlParse(url);
    const urlPath = pasredUrl.path.split('/')
        .filter(component => {
            return component !== '';
        })
        .map(component => {
            return slug(component);
        })
        .join('/');

    let filename = path.join(pasredUrl.hostname, urlPath);

    if(!path.extname(filename).match(/htm/)) {
        filename += '.html';
    }
    return filename;
}

module.exports.getLinkUrl = (currentUrl, element) => {
    
    const link = urlResolve(currentUrl, element.attribs.href || "");
    const parsedLink = urlParse(link);
    const currentParsedUrl = urlParse(currentUrl);

    if(parsedLink.hostname !== currentParsedUrl.hostname || !parsedLink.pathname) {
        return null;
    }

    return link;
}

module.exports.getPageLinks = (currentUrl, body) => {

    return [].slice.call(cheerio.load(body)('a'))
        .map(element => {
            return module.exports.getLinkUrl(currentUrl, element)
        })
        .filter(element => {
            return !!element;
        });
}