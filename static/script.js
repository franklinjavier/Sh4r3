var Sh4r3 = Sh4r3 || {};

Sh4r3 = (function( window, $ ) {

    var dropZone = document.getElementById('dropZone');
    var dropHere = document.getElementById('dropHere');
    var allow = {
        size: 2100000,
        extension: /png|jpg|jpeg|gif/
    };

    var App = {

        init: function() {

            if ( window.File && window.FileReader && window.FileList && window.Blob ) {

                // Setup the dnd listeners
                dropZone.addEventListener( 'dragover', this.handleDragOver, false );
                dropZone.addEventListener( 'dragleave', this.handleDragLeave, false );
                dropZone.addEventListener( 'drop', this.readBlob, false );

            } else {
                document.getElementById('wrapper').className = 'hide';
                alert('The File APIs are not fully supported in this browser :(');
            }

        },

        readBlob: function( evt ) {

            evt.stopPropagation();
            evt.preventDefault();

            // reset message
            document.getElementById('messageOk').className = 'hide';

            var files = evt.dataTransfer.files[ 0 ], // FileList object
                fileName = files.name,
                extension = fileName.split('.')[ 1 ].toLowerCase();

            // Drop a file with an extension not allowed
            if ( !allow.extension.test( extension ) ) {

                App.notAllowed('File not allowed');

                return false;

            }

            // File is to big
            if ( files.size > allow.size ) {
                App.notAllowed('File is too big');
                return false;
            }

            evt.target.className = '';

            var reader = new FileReader(),
                start =  0,
                stop = files.size - 1,
                link = document.getElementById('link');

            reader.readAsDataURL( files, 'UTF-8' );

            // If we use onloadend, we need to check the readyState.
            reader.onloadend = function( evt ) {

                if ( evt.target.readyState === FileReader.DONE ) { // DONE == 2

                    var result = evt.target.result,
                        formData = new FormData(evt.target.result),
                        token = App.generateToken();

                    $.ajax({
                        url: '/save',
                        type: 'POST',
                        data: { token: token, content: result },
                        success: function( data ) {
                            console.log(data);
                        }
                    });

                    window.location.replace(window.location.href + 'view/' + token);

                    /*
                    console.log(document.getElementById('byteRange')
                                .innerText = 'Read bytes: ' + files.size + ' byte file', App.fileSize(files.size));

                    document.getElementById('messageOk').className = 'show';
                    evt.target.className = '';
                    */

                }

            };

        },

        handleDragOver: function( evt ) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy
            evt.target.className = 'active';
        },

        handleDragLeave: function( evt ) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.target.className = '';
        },

        notAllowed: function ( msg ) {

            dropZone.className = 'drag-not-allow';
            dropHere.innerText = msg;

            setTimeout(function() {
                dropZone.className = '';
                dropHere.innerText = 'Drop here';
            }, 2000);

        },

        generateToken: function() {
            return Math.random().toString(36).substr(2, 5);
        },

        fileSize: function( size ) {

            var i = -1,
                byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

            do {
                size = size / 1024;
                i++;
            } while (size > 1024);

            return Math.max(size, 0.1).toFixed(1) + byteUnits[i];

        }

    };

    App.init();

}( window, jQuery ));
