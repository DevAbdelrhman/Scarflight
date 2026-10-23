/**
 * Team Members Data Configuration
 *
 * This file is the single source of truth for the team members avatar marquee
 * rendered in the Upper Hero section of the homepage.
 *
 * How to edit:
 * - Rename a member: Change the 'name' field (e.g. name: "Alice").
 * - Add an 11th member: Add an object to the array with a unique 'id', 'name', and 'image' path:
 *     { id: 'lead', name: 'LEAD', image: './images/team/lead.jpg' }
 * - Remove a member: Delete or comment out the object from the array.
 * - Replace a portrait: Place the portrait image in 'src/images/team/' (e.g. 'src/images/team/eng.jpg')
 *   and ensure the 'image' property points to './images/team/eng.jpg'.
 *   If the image file is missing or not yet added, a clean neutral placeholder will be shown automatically.
 */

export const teamMembers = [
    {
        id: 'mohamed-wahid',
        name: 'Mohamed Wahid',
        role: 'Web Developer',
        specialty: 'Web Developer',
        image: './images/team/eng.jpg'
    },
    {
        id: 'menna-ahmed',
        name: 'Menna Ahmed',
        role: 'Automation Engineer',
        specialty: 'Automation Engineer',
        image: './images/team/mn.jpg'
    },
    {
        id: 'mohamed-mostafa',
        name: 'Mohamed Mostafa',
        role: 'Automation Engineer',
        specialty: 'Automation Engineer',
        image: './images/team/dev.jpg'
    },
    {
        id: 'al-zahraa',
        name: 'Al-Zahraa',
        role: 'Python Developer',
        specialty: 'Python Developer',
        image: './images/team/ux.jpg'
    },
    {
        id: 'abdelrahman-elshnawy',
        name: 'Abdelrahman Elshnawy',
        role: 'PM & Hardware ',
        specialty: 'PM & Hardware Engineer',
        image: './images/team/pm.jpg'
    },
    {
        id: 'menna-emad',
        name: 'Menna Emad',
        role: 'CAD & 3D Design',
        specialty: 'CAD & 3D Design',
        image: './images/team/ui.jpg'
    },
    {
        id: 'omar',
        name: 'Omar',
        role: 'Cloud Engineer',
        specialty: 'Cloud Engineer',
        image: './images/team/be.jpg'
    },
    {
        id: 'manar-waheed',
        name: 'Manar Waheed',
        role: 'Docs & Design',
        specialty: 'Docs & Design',
        image: './images/team/hr.jpg'
    },
    {
        id: 'samuel',
        name: 'Samuel',
        role: 'Cybersecurity ',
        specialty: 'Cybersecurity ',
        image: './images/team/qa.jpg'
    },
    {
        id: 'ahmed',
        name: 'Ahmed',
        role: 'Python Developer',
        specialty: 'Python Developer',
        image: './images/team/fe.jpg'
    },
];
export default teamMembers;
