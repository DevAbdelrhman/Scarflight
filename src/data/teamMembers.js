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
    { id: 'eng', name: 'ENG', image: './images/team/eng.jpg' },
    { id: 'mn',  name: 'MN',  image: './images/team/mn.jpg' },
    { id: 'ux',  name: 'UX',  image: './images/team/ux.jpg' },
    { id: 'ui',  name: 'UI',  image: './images/team/ui.jpg' },
    { id: 'dev', name: 'DEV', image: './images/team/dev.jpg' },
    { id: 'qa',  name: 'QA',  image: './images/team/qa.jpg' },
    { id: 'hr',  name: 'HR',  image: './images/team/hr.jpg' },
    { id: 'pm',  name: 'PM',  image: './images/team/pm.jpg' },
    { id: 'fe',  name: 'FE',  image: './images/team/fe.jpg' },
    { id: 'be',  name: 'BE',  image: './images/team/be.jpg' },
];

export default teamMembers;
