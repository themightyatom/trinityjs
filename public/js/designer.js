export function Designer(domElement){

this.domElement = domElement;


domElement.addEventListener('mousemove', checkObjects);


function checkObjects(event){
    event.preventDefault();
        mouse.x = (event.clientX / width3d) * 2 - 1;
        mouse.y = - (event.clientY / height3d) * 2 + 1;
        camera.updateMatrixWorld();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(snapPoints);

        if (intersects.length > 0) {
            console.log("int", intersects[0].object.material.opacity);
            if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED) INTERSECTED.material.opacity = INTERSECTED.currentOpacity;
                INTERSECTED = intersects[0].object;
                INTERSECTED.currentOpacity = INTERSECTED.material.opacity;
                INTERSECTED.material.opacity = 1;
                potentialPosition.copy(INTERSECTED.matrixWorld);
                console.log(potentialPosition)
            }
        } else {
            if (INTERSECTED) INTERSECTED.material.opacity = INTERSECTED.currentOpacity;
            INTERSECTED = null;
        }
        render();
}





}

