;(function () {
	"use strict";

	angular.
		module("newBook").
		component("imageUploader", {
			template: ` 
				<div
					id="dnd-container"
					ng-style="{'background': $ctrl.imageUploaded ? 'url(' + $ctrl.imageUrl + ')50% 50%/ cover no-repeat' : '#fff' }">
					<i class="fa fa-upload fa-3x" aria-hidden="true" ng-class="{ 'hidden-content': $ctrl.isHidden }"></i>
					<p ng-class="{ 'hidden-content': $ctrl.isHidden }">Drag & Drop files <br><br><br>Or</p>
					</div>
				<label for="book-cover-select" name="book-cover-select">Browse</label>
				<input id="book-cover-select" type="file" accept=".png,.jpg"/>
			`,
			bindings: {
				createCover: "&"
			},
			controller: ImageUploaderController
		});

		ImageUploaderController.$inject = ["$scope"];

		function  ImageUploaderController($scope) {
			let vm = this;

			vm.uploadFile = uploadFile,
			vm.selectCover = selectCover;
			vm.imageUploaded = false;
			vm.imageUrl = null;
			vm.isHidden = false;

			document.getElementById("book-cover-select").addEventListener("change", selectCover);
			document.getElementById("dnd-container").addEventListener("dragover", cancelDrag, false);
			document.getElementById("dnd-container").addEventListener("dragenter", cancelDrag, false);
			document.getElementById("dnd-container").addEventListener("drop", dropCover, false);

			function uploadFile() {}

			function selectCover(ev) {
				let file = ev.target.files[0];
				renderPreview(file);
				vm.createCover({ file });
			}

			function cancelDrag(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			}


			function dropCover(ev) {
				ev.preventDefault();
				ev.stopPropagation();

				let file = ev.dataTransfer.files[0];
				renderPreview(file);
			}

			function renderPreview(file) {
				let reader = new FileReader();
				reader.addEventListener("load", renderImage)

				function renderImage() {
					vm.imageUrl = reader.result;
					vm.imageUploaded = true;
					vm.isHidden = true;
					// document.getElementById("dnd-container").style.fontSize="0px";
					$scope.$apply();
				}

				reader.readAsDataURL(file)
				vm.createCover({ file });
			}
		}
})();
