# Minecraft Skin Viewer
[![CI Status](https://img.shields.io/github/actions/workflow/status/MinecraftCapes/minecraft-cape-creator/build.yml?branch=main&label=deploy&logo=github&style=flat-square)](https://github.com/MinecraftCapes/minecraft-cape-creator/actions?query=workflow:deploy)
[![NPM Package](https://img.shields.io/npm/v/minecraft-cape-creator.svg?style=flat-square)](https://www.npmjs.com/package/minecraft-cape-creator)

Built for the [MinecraftCapes](https://minecraftcapes.net) website.

Demo - https://minecraft-cape-creator.pages.dev

## Example
### Creating an instance
```js
import MinecraftCapeCreator from 'minecraft-cape-creator'

this.minecraftCapeCreator: new MinecraftCapeCreator()
```

### Building a cape
You'll want to build a new cape after making any changes. The value returned is a base64 of the image. This can be displayed however you choose.
```js
this.minecraftCapeCreator.buildCape().then(value => {
    console.log(value);
})
```
### Change Texture
Provide a texture to show on the cape and elytra. The aspect ration will be squeezed to 1.6:1 so it's best to use a cropper tool like CropperJS.
```js
changeImage() {
    this.minecraftCapeCreator.setImage(image /* url | base64 | local */)
    this.buildCape();
}
```
### Change Cape/Elytra Color
You can either set a hex value #FF0000 or use setAutoColor which will calculate the colour based on the image.
```js
changeColour() {
    this.minecraftCapeCreator.setAutoColor()
    this.minecraftCapeCreator.setColor(this.color)
    this.buildCape()
}
```
### Change scale
This will change the resolution of the cape. Min 1, Max 6. 1 = 64x32, 6 = 2048x1024. Obviously a larger scale will mean a clearer image.
```js
changeScale() {
    this.minecraftCapeCreator.setScale(this.scale)
    this.buildCape()
}
```
### Download Cape
Pretty self expanitory
```js
downloadCape() {
    this.minecraftCapeCreator.downloadCape("Optional Name.png");
}
```