const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
const video = document.getElementById('video');
const scanText = document.getElementById('scanText');
const scanIcon = document.getElementById('scanIcon');
const cameraBtnText = document.getElementById('cameraBtnText');
const openCameraIcon = document.getElementById('openCameraIcon');
const captureOptions = {
    audio: false,
    video: true,
    video: { facingMode: "environment" },
};
var counter = 0;

//Requests camera access from user and begins video stream. 
const openCamera = () => {      
    counter = 1;
    scanIcon.innerText = 'camera';
    scanText.innerText = "scan label";
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia(captureOptions).then(function (stream) {
            video.srcObject = stream;
            video.play();
            context.clearRect(0, 0, canvas.width, canvas.height);
        })
    };
}
//Takes a photo for verification prior to sending.
const takePhoto = () => {
    if (counter != 0) {
        if (counter == 1) {
            counter = 2;
            cameraBtnText.innerText = "retake photo";
            openCameraIcon.innerText = "cached";
            scanIcon.innerText = "file_upload";
            scanText.innerText = "process label";
            canvas.height = $('video').innerHeight();
            canvas.width = $('video').innerWidth();
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        else {
            $('.modal').modal('open');
        }
    }
}

const uploadImg = (formData) => {
    $.ajax({
        enctype: 'multipart/form-data',
        url: '/api/vision',
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
        success: (result) => {
            if (result.statusCode == 200) {
                location.href = '/result';
            }
            else {
                M.toast({ html: result.message });
                location.reload();
            }
        },
        error: (err) => {
            M.toast({ html: err.message });
        }
    })
}

const submitImg = (productName) => {
    canvas.toBlob(function (blob) {
        const formData = new FormData();
        formData.append('label', blob, 'label.jpg');
        formData.append('product', productName);
        console.log(formData);
        uploadImg(formData);
    },
        'image/jpeg');
}

$(function () {
    $('.modal').modal();
    $('#openCamera').click(() => {
        openCamera()
    });

    $('#formSubmit').click(() => {
        var productName = $('#productName').val();
        if (productName == '') {
            M.toast({ html: "Please provide a product name to continue..." });
        }
        else {
            submitImg(productName);
        }
    });
});

function calcRoute(e) {

    var productName = $('#productName').val();
    if (productName == '') {
        M.toast({ html: "Please provide a product name to continue..." });
    }
    else {
        submitImg(productName);
    }  
    
    e.preventDefault();
}

(function() {
    var form = document.getElementsByTagName('form')[0];    
    form.addEventListener('submit', calcRoute);
    


}());
