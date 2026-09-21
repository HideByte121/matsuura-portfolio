// 公開用のメールアドレス。空欄ではリンクを表示しません。
const portfolio = { email: 'matsuura.hideyuki1111001@gmail.com' };

// 公開済みURLとの互換性のため、id は変更しません。
// youtubeId はYouTube動画のID。画像は任意で追加できます。
const works = [
  {
    id: 'sample-01',
    title: '5GameBowling',
    summary: 'C++とDirectXで初めて制作した3Dボウリングゲーム。ピンの当たり判定や、衝突後の倒れ方・ばらけ方に取り組みました。',
    tools: 'C++ / DirectX',
    youtubeId: 'zbY_-nGU9DM',
    thumbnail: '',
    images: [],
    description: 'DirectXを使い、初めて3Dゲーム制作に取り組んだ個人作品です。ボウリングを題材に、3Dモデルの制御や当たり判定など、3Dゲームの基本的な仕組みを実装しました。',
    period: '約1か月',
    teamSize: '1人（個人制作）',
    role: '制作全般',
    highlights: '特に力を入れたのは、ピンの制御です。衝突後にピンがどのように倒れ、周囲へばらけるかを意識して挙動を調整しました。初めての3D制作で当たり判定やモデルの制御に苦労しながらも、動作を確かめながら実装を進めました。',
    links: []
  },
  {
    id: 'sample-02',
    title: 'RE：TRACE',
    summary: '行動を録画・再生し、過去の自分と協力して進む2Dパズルアクション。7人でのチーム制作で、ギミックとシェーダーを担当しました。',
    tools: 'C# / Unity',
    youtubeId: 'YBtmxOndqW8',
    thumbnail: '',
    images: [],
    description: '自分の移動やギミック操作を記録し、その動きを再現する「リプレイ」と協力してゴールを目指す2Dパズルアクションゲームです。複数のリプレイを組み合わせ、ボタン、動く床、シャッターなどを活用してステージを攻略します。Unityを使い、7人のチームで制作しました。',
    period: '約2か月',
    teamSize: '7人（チーム制作）',
    role: 'ギミック制作・シェーダー制作',
    highlights: 'チームのメンバーがコードを変更せずに調整できるよう、ギミックの設定をUnityのインスペクターから操作できる形にしました。\n\n同じボタンでも異なる挙動に対応できるよう、C#の継承を活用して共通処理と個別の処理を整理しました。UnityとC#の使い方を学びながら実装し、制作の終盤にはシェーダー制作にも取り組みました。',
    links: []
  },
  {
    id: 'sample-03',
    title: '暖弾Done',
    summary: '精霊を暖めて焚き火を維持するサバイバルアクション。初めてのUnreal Engine作品として、Blueprintを中心に個人制作しました。',
    tools: 'Unreal Engine / Blueprint',
    youtubeId: '9ngD_UeFAzw',
    thumbnail: '',
    images: [],
    description: '暖気弾で精霊を暖め、焚き火の燃料に変えながら夜を乗り切る、温度管理サバイバルアクションです。学校で学んだUnreal Engineを使って初めて制作したゲームで、第26回UE5ぷちコンへの応募作品です。',
    period: '約2週間',
    teamSize: '1人（個人制作）',
    role: '制作全般',
    highlights: 'Blueprintで処理の流れを一つずつ追いながら、ゲームのアルゴリズムを組み立てました。コードとは異なる視覚的な実装を経験し、Unreal Engineでの制作方法を学びました。\n\nマテリアルによる表現やNiagaraのエフェクトなど、Unreal Engineならではの機能も活用して制作しました。',
    links: []
  }
];
