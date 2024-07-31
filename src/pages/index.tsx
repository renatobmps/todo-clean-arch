import React, { ReactElement, useEffect, useState } from 'react';
import css from './home.module.css';
import Image from 'next/image';

export default function Page(): ReactElement {
    const [pageName, setPageName] = useState<string>('Página sem nome');
    const [characteres, setCharacteres] = useState<Array<{ name: string, alias: string, icon: string }>>([]);

    useEffect(() => {
        (async () => {
            const request = await fetch('/api');
            if (request.status !== 200) alert('Erro com a rota')
            const data = await request.json();

            setPageName(data.pageName);
            setCharacteres(data.characteres);
        })()
    }, [])

    return <div>
        <h1>{pageName}</h1>
        <ul>
            {
                characteres.map(character => <li className={css.character}>
                    <span>
                        {character.alias}
                        <Image alt={character.alias} height={16} src={character.icon} width={16} />
                    </span>
                    <span>{character.name}</span>
                </li>)
            }
        </ul>
    </div>
}