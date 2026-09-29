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
    technicalNotes: [
      {
        "title": "細長いピンを3つの球で近似する",
        "problem": "ピンは縦に長いため、中心に球を1つ置くだけでは、見た目に合う当たり判定を作りにくいと考えました。",
        "approach": "ピンの中心・上・下に3つの球を配置し、どれか1つがボールに触れたら衝突と判定する形にしました。上下の間隔にはピンの高さの1/4を使い、モデルの大きさを判定位置に反映しています。",
        "point": "複雑なモデル形状をそのまま判定する代わりに、球同士の判定を組み合わせています。球の中心間距離は二乗のまま比較し、接触の有無を求める段階では平方根の計算を使わない実装です。",
        "snippets": [
          {
            "source": "collisionSystem.cpp / 175–198行（抜粋）",
            "code": "constexpr int SPHERE_CENTERS_COUNT = 3;\n\nfloat offset = pin.GetHeight() * 0.25f;\nVector3 pinPos = pin.GetPosition();\n\nVector3 sphereCenters[SPHERE_CENTERS_COUNT] = {\n    pinPos,\n    Vector3(pinPos.x, pinPos.y + offset, pinPos.z),\n    Vector3(pinPos.x, pinPos.y - offset, pinPos.z)\n};\n\nfor (int i = 0; i < SPHERE_CENTERS_COUNT; i++)\n{\n    if (CheckCircleCollider3D(\n        ball.GetPosition(),\n        ball.GetScaledRadius(),\n        sphereCenters[i],\n        pin.GetRadius()))\n    {\n        return true;\n    }\n}\n\nreturn false;"
          },
          {
            "source": "collision.cpp / 35–48行（抜粋）",
            "code": "Vector3 Length;\nLength.x = PosA.x - PosB.x;\nLength.y = PosA.y - PosB.y;\nLength.z = PosA.z - PosB.z;\n\nfloat dist2 = (Length.x * Length.x) + (Length.y * Length.y) + (Length.z * Length.z);\nfloat R = (RadiusA + RadiusB) * (RadiusA + RadiusB);\n\nif (dist2 < R)\n{\n    return true;\n}\n\nreturn false;"
          }
        ]
      },
      {
        "title": "衝突位置から、ピンが倒れる向きを決める",
        "problem": "ピンが常に同じ方向へ倒れると、ボールを当てた位置と見た目の反応がつながりにくくなります。",
        "approach": "ボールからピンへ向かう方向をXZ平面で求め、正規化して倒れる方向として保存しました。描画時にはその方向に直交する回転軸を作り、倒れる角度を適用しています。",
        "point": "倒れる向きと移動速度を別々に扱っています。向きは衝突位置から、移動速度はボールの速度から決めることで、当たった位置と勢いをそれぞれ表現に使っています。これは簡易的な挙動制御で、厳密な剛体シミュレーションではありません。",
        "snippets": [
          {
            "source": "pin.cpp / 148–173行（抜粋）",
            "code": "Vector3 ballPos = ball.GetPosition();\n\nVector3 dir\n{\n\tm_Position.x - ballPos.x,\n\t0.0f,\n\tm_Position.z - ballPos.z\n};\n\nfloat len = sqrtf(dir.x * dir.x + dir.z * dir.z);\nif (len > 0.0001f)\n{\n\tdir.x /= len;\n\tdir.z /= len;\n}\n\nm_FallDir = dir;\n\nVector3 ballV = ball.GetVelocity();\nfloat power = 2.0f;\n\nm_Velocity.x += ballV.x * power;\nm_Velocity.z += ballV.z * power;\n\nm_IsFalling = true;\nm_FallAngle = 0.0f;"
          },
          {
            "source": "pin.cpp / 94–101行（抜粋）",
            "code": "Vector3 axis = { -m_FallDir.z, 0.0f, m_FallDir.x };\nfloat len = sqrtf(axis.x * axis.x + axis.z * axis.z);\nif (len > 0.0001f) {\n\taxis.x /= len;\n\taxis.z /= len;\n\tXMVECTOR axisVec = XMVectorSet(axis.x, axis.y, axis.z, 0.0f);\n\tmatrix.World *= XMMatrixRotationAxis(axisVec, m_FallAngle);\n}"
          }
        ]
      },
      {
        "title": "倒れる角度に合わせて、床からの高さを調整する",
        "problem": "立っているピンと横になったピンでは、床から中心までの高さが異なります。高さを固定すると、倒れたときに浮いたり床へめり込んだりする見た目につながります。",
        "approach": "床との接触時に、立っている状態では高さの半分、倒れきった状態では半径を中心の高さとして使いました。倒れている途中は、0〜90度の角度を割合に変換し、2つの高さの間を線形補間しています。",
        "point": "回転だけでなく位置も変えることで、倒れていく途中の接地の見た目を調整しています。形状に厳密に沿った接触計算ではなく、少ない計算で姿勢に合わせた高さを得る近似です。",
        "snippets": [
          {
            "source": "collisionSystem.cpp / 138–157行（抜粋・コメント省略）",
            "code": "if (!pin.IsFalling() || pin.GetFallAngle() <= 0.01f)\n{\n    yOffset = pin.GetHeight() * 0.5f;\n}\n\n\nelse if (pin.GetFallAngle() >= XM_PIDIV2 - 0.01f)\n{\n    yOffset = pinRadius;\n}\n\nelse\n{\n    float t = pin.GetFallAngle() / XM_PIDIV2;\n    float standY = pin.GetHeight() * 0.5f;\n    float lieY = pinRadius;\n    yOffset = standY * (1.0f - t) + lieY * t;\n}\n\npinPos.y = modelTopSurface + yOffset;"
          }
        ]
      },
      {
        "title": "ピン同士で倒れる動きを連鎖させる",
        "problem": "ボールが直接当たったピンだけが倒れるのでは、ボウリングらしいばらけ方を表現できません。",
        "approach": "倒れているピンと立っているピンが接触したら、立っている側に衝突処理を渡すようにしました。衝突相手から離れる方向と、そのピンの水平速度を使って次のピンの動きを決めています。",
        "point": "受け渡す速さには「相手の速さ×0.8」と「最低値2.0」の大きい方を使います。低速でも一定の動きを与える調整で、物理的な正確さだけでなく、ピンが連鎖して倒れる見た目を意識した実装です。",
        "snippets": [
          {
            "source": "collisionSystem.cpp / 259–268行（抜粋）",
            "code": "if (pinA.IsFalling() && !pinB.IsFalling())\n{\n    pinB.OnHitByPin(pinA);\n    velB = pinB.GetVelocity();\n}\nelse if (!pinA.IsFalling() && pinB.IsFalling())\n{\n    pinA.OnHitByPin(pinB);\n    velA = pinA.GetVelocity();\n}"
          },
          {
            "source": "pin.cpp / 196–205行（抜粋）",
            "code": "Vector3 pinV = pin.GetVelocity();\nfloat speed = sqrtf(pinV.x * pinV.x + pinV.z * pinV.z);\nfloat power = std::max(speed * 0.8f, 2.0f);\n\nm_FallDir = dir;\nm_Velocity.x += dir.x * power;\nm_Velocity.z += dir.z * power;\n\nm_IsFalling = true;\nm_FallAngle = 0.0f;"
          }
        ]
      }
    ],
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
