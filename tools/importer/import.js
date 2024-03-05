export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    html,
    params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.querySelector(".entry-content.clear");

    // attempt to remove non-content elements
    WebImporter.DOMUtils.remove(main, ["#ez-toc-container"]);

    const target = document.createElement("div");

    const blogs = main.querySelectorAll("div > p,h2,figure");
    let currentBlogCount = 0;
    for (let i = 0; i < blogs.length; i++) {
      console.log(blogs[i].nodeName);

      if (blogs[i].nodeName.includes("H2")) ++currentBlogCount;
      if (currentBlogCount === 6) break;
      target.append(blogs[i]);
    }

    //   WebImporter.rules.createMetadata(main, document);
    //   WebImporter.rules.transformBackgroundImages(main, document);
    //   WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    //   WebImporter.rules.convertIcons(main, document);
    const header = document.createElement("h1");
    header.innerHTML = target.firstChild.innerHTML;
    target.firstChild.replaceWith(header);
    header.innerText = header.innerText.slice("");
    return target;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    html,
    params,
  }) => {
    let p = new URL(url).pathname;
    if (p.endsWith("/")) {
      p = `${p}index`;
    }
    return decodeURIComponent(p)
      .toLowerCase()
      .replace(/\.html$/, "")
      .replace(/[^a-z0-9/]/gm, "-");
  },
};
