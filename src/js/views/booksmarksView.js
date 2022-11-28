import View from './View.js';
import icons from '../../img/icons.svg';
import previewView from './previewView.js';

class BooksmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yer. Find a nice recipe and bookmark it ;))';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BooksmarksView();
