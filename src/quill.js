export const modules = {
    toolbar: [
        [{ header: ['1', '2', '3', '4', '5'] }, { font: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' },
            { indent: '-1' }, { indent: '+1' }],
        ['link', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false
    }
}

export const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'video'
]