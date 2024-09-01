// async function sendMessage() {
//     fd = new FormData();
//     let token = '{{ csrf_token }}';
//     fd.append('textmassage', textmassageField.value);
//     fd.append('csrfmiddlewaretoken', token);
//     try {
//         await fetch('/chat/', {
//             method: 'POST',
//             body: fd
//         });
//         console.log('Success!!!');

//     } catch (error) {
//         console.error('An error occured:', error);

//     }
// }