# VIDAA

Virtual Implantation and Device selection in left Atrial Appendages, VIDAA, is a web-based 3D interactive virtual implantation platform. The platform allows clinicians to select the most appropriate Left Atrial Appendage Occluder (LAAO) device configurations for a given patient, between Amplatzer AMULET and Watchman. The main features of VIDAA include: the joint visualization of left atrial (LA) and LAAO device meshes, visualization of left atrial appendage morphological parameters (centreline and transversal planes with its maximal and minimal diameters).

The workflow is described in Aguado AM, Olivares AL, Yagüe C, Silva E, Nuñez-García M, Fernandez-Quilez Á, Mill J, Genua I, Arzamendi D, De Potter T, Freixa X and Camara O (2019) *In silico Optimization of Left Atrial Appendage Occluder Implantation Using Interactive and Modeling Tools*. Front. Physiol. 10:237. doi: 10.3389/fphys.2019.00237. Please cite this reference when using VIDAA platform. [Link to the article](https://www.frontiersin.org/articles/10.3389/fphys.2019.00237/full?&utm_source=Email_to_authors_&utm_medium=Email&utm_content=T1_11.5e1_author&utm_campaign=Email_publication&field=&journalName=Frontiers_in_Physiology&id=431074)

Original Developers: Ainhoa Marina Aguado Martin, Carlos Yagüe Méndez. Contributors: Andy L. Olivares, Oscar Camara, Xavier Freixa, Maria del Pilar García, Ibai Genua Gamio, Álvaro Férnandez-Quilez, Jordi Mill.

## VIDAA Demo
Watch the video below to know how the VIDAA platform works.

[![Watch the video](https://github.com/Ainhoagu/VIDAA/blob/master/public/VIDAA_DEMO.png)](https://youtu.be/7KcxhVsG3gU) 

## Required Files
- LA mesh: *.stl* format
- Left Atrial Appendage (LAA) centreline: *.vtk* format. The centreline is a line equidistant to all the walls of the LAA. The centreline must include just the points that construct the line.
- Morphological measurements: *.xlsx* format. File containing maximal (D1) and minimal (D2) diameters of the transversal planes of the centreline. Having the following format,

| D1            | D2            |
| ------------- | ------------- |
| 21,64952717   | 10,76328256   |
| 21,32561156   | 10,95678248   |

and diameters' values in milimeters.

## Example Folders
In each folder you will find the three required files (LA mesh, LAA centreline and measurements) to run the platform with one specific patient.
- [Patient 1](https://github.com/Ainhoagu/VIDAA/tree/master/assets/P1)
- [Patient 2](https://github.com/Ainhoagu/VIDAA/tree/master/assets/P2)
- [Patient 3](https://github.com/Ainhoagu/VIDAA/tree/master/assets/P3)
- [Patient 4](https://github.com/Ainhoagu/VIDAA/tree/master/assets/P4)

## Quick start
Clone repository
```
git clone https://github.com/Ainhoagu/VIDAA.git
```
Installing dependencies
```
yarn install
```
Running the app
```
yarn start
```
Once the server has started, drag one by one the required files (a tick will appear if the file has been loaded correctly).

### Data View
In this mode you can visualize the morphological measurements of patient's LAA. With the toolbox on the right you can move the transversal plane from which the morphological measurements are visualized.

### LAAO Implantation
Virtual Implantation with the proposed devices having:

Clipping of the LA mesh to focus in the LAA during virtual implantation. Planes can be moved using the toolbox on the right ("Clipping Tools").

Default position, size and orientation of the device are automatically calculated from patient-specific morphological measurements. The landing zone (implantation zone) of the Amplatzer AMULET is defined at 10 mm from the ostium (entrance of the LAA) and of the Watchman at 13 mm.

Device manipulation: translation (press "T" key), rotation (press "R" key) and scaling (from toolbox). Device can just be expanded or stretched a maximum of 20% on the three directions (x, y, z).

## License
VIDAA is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

VIDAA platform is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details. The software cannot be used for clinical decision making.

You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

## Funding
This work was supported by the Spanish Ministry of Economy and Competitiveness under the Maria de Maeztu Units of Excellence Programme (MDM-2015-0502) and the Retos I+D Programme (DPI2015-71640-R).
