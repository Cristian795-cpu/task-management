export class Task {
    // Ahora acepta un tercer parámetro `bookmarked` (default false)
    constructor(titleNote, textNote, bookmarked = false) {
        this.titleNote = titleNote;
        this.textNote = textNote;
        this.bookmarked = bookmarked;
    }

    set setTextNote(textNote) {
        this.textNote = textNote;
    }

    get getTextNote() {
        return this.textNote
    }

    set setTitleNote(titleNote) {
        this.titleNote = titleNote;
    }

    get getTitleNote() {
        return this.titleNote;
    }

    // Bookmark getters/setters
    set setBookmarked(value) {
        this.bookmarked = !!value;
    }

    get isBookmarked() {
        return this.bookmarked === true;
    }

}