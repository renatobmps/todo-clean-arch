import { NextApiRequest, NextApiResponse } from "next";

export default function route(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(403);

    return res.status(200).json({
        pageName: 'Name provided by API',
        characteres: [
            { name: 'Peter Parker', alias: 'Spiderman', icon: 'https://cdn4.iconfinder.com/data/icons/heroes-villains-vol-2-colored/100/Spiderman-512.png' },
            { name: 'Bruce Benner', alias: 'Hulk', icon: 'https://img.icons8.com/?size=100&id=38038&format=png&color=000000' },
            { name: 'Matt Murdok', alias: 'Daredevil', icon: 'https://cdn0.iconfinder.com/data/icons/famous-character-vol-1-colored/48/JD-11-512.png' },
        ]
    })
}