import Swal from 'sweetalert2';
import { useEffect } from 'react';

const MODAL_LINK_CLASS_NAME = 'modal-link';

function ariaHandler(e) {
  let x = e.getAttribute('aria-live');
  if (x !== 'off') {
    x = 'off';
  }
  e.setAttribute('aria-live', x);
}

function openMediaModal({ title, src, type }) {
  let elementHtml;
  switch (type) {
    case 'youtube':
      elementHtml = `<iframe width="720" height="400" src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      break;
    case 'img':
      elementHtml = `<img src="${src}" alt="${title}">`;
      break;
    case 'video':
      elementHtml = `<video controls>
					<source src="${src}">
					Your browser does not support the video tag.
				</video>`;
      break;
    case 'audio':
      elementHtml = `<audio controls>
					<source src="${src}">
					Your browser does not support the audio element.
				</audio>`;
      break;
    default:
      console.error('Sorry, we are out of type');
  }

  Swal.fire({
    title,
    html: elementHtml,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'close',
    width: 'fit-content',
    didRender: ariaHandler,
  });
}

export const useBindModalLinkEffect = () => {
  useEffect(() => {
    const handleClick = (event) => {
      const dataset = event.target.dataset;

      openMediaModal({
        title: dataset.title,
        src: dataset.src,
        type: dataset.type,
      });
    };
    const elements = document.querySelectorAll(`.${MODAL_LINK_CLASS_NAME}`);

    // Bind a click event to each element
    elements.forEach(function (element) {
      element.addEventListener('click', handleClick);
    });

    return () => {
      const elements = document.querySelectorAll(`.${MODAL_LINK_CLASS_NAME}`);

      // Bind a click event to each element
      elements.forEach(function (element) {
        element.removeEventListener('click', handleClick);
      });
    };
  }, []);
};

const imageExtensions = ['jpg', 'jpeg', 'png'];
const videoExtensions = [
  'mp4',
  'mpg',
  'mpeg',
  '.flv',
  '.mov',
  '.wmv',
  '.avi',
  '.ogg',
];
const audioExtensions = ['mp3', 'aac', 'wav', 'flac'];

function findExtensionType(fileExtension) {
  if (imageExtensions.includes(fileExtension)) {
    return 'img';
  }
  if (videoExtensions.includes(fileExtension)) {
    return 'video';
  }
  if (audioExtensions.includes(fileExtension)) {
    return 'audio';
  }
  console.error(`${fileExtension} file extension is invalid.`);
  return '';
}

class YoutubeVideo {
  static toEmbeddableVideo(path) {
    if (path.includes('/watch')) {
      const url = new URL(path);
      const youtubeCode = url.searchParams.get('v');
      return `https://www.youtube.com/embed/${youtubeCode}`;
    } else if (path.includes('/youtu.be/')) {
      const urlSplit = path.split('/');
      const youtubeCode = urlSplit[urlSplit.length - 1];
      return `https://www.youtube.com/embed/${youtubeCode}`;
    } else {
      return;
    }
  }

  static isYoutube(path) {
    return path.includes('youtube.com') || path.includes('youtu.be');
  }

  static isEmbeddable(path) {
    return path.includes('/embed/');
  }
}

function isInternalLink(path) {
  return path.startsWith('#');
}

function linkHandler(htmlStr) {
  const temp = document.createElement('div');
  temp.innerHTML = htmlStr;

  Array.from(temp.querySelectorAll('a')).forEach(function (element) {
    let assetPath = element.getAttribute('href');
    if (!assetPath) {
      element.setAttribute('target', `blank`);
      return;
    }

    if (isInternalLink(assetPath)) {
      return;
    }

    if (YoutubeVideo.isYoutube(assetPath)) {
      const text = element.innerText || element.textContent;
      if (!YoutubeVideo.isEmbeddable(assetPath)) {
        assetPath = YoutubeVideo.toEmbeddableVideo(assetPath);
      }

      element.setAttribute('href', 'javascript:void(0)');
      element.setAttribute('data-title', text);
      element.setAttribute('data-src', assetPath);
      element.setAttribute('data-type', 'youtube');
      element.classList.add(MODAL_LINK_CLASS_NAME);

      return;
    }

    const fileExtension = assetPath.split('.').pop();
    const fileExtensionType = findExtensionType(fileExtension.toLowerCase());
    const text = element.innerText || element.textContent;

    if (fileExtensionType) {
      element.setAttribute('href', 'javascript:void(0)');
      element.setAttribute('data-title', text);
      element.setAttribute('data-src', assetPath);
      element.setAttribute('data-type', fileExtensionType);
      element.classList.add(MODAL_LINK_CLASS_NAME);

      return;
    }

    element.setAttribute('target', `blank`);
  });

  return temp.innerHTML;
}

export default linkHandler;
