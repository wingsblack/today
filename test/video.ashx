<%@ WebHandler Language="C#" Class="video" %>

using System;
using System.Web;
using System.IO;
using tc.pz.sqlDB;
using System.Data;
using System.Data.SqlClient;

using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class video : IHttpHandler
{


    private HttpRequest Request;
    private HttpResponse Response;

    private HttpContext context;
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        this.context = context;
        Request = context.Request;
        Response = context.Response;

        string a = context.Request.QueryString["a"];

        switch (a)
        {
            case "s":
                this.SaveImage();
                break;
            case "v":
                this.Share();
                break;
            case "c":
                this.Check();
                break;
        }





    }

    //检测分享人
    private void Check()
    {
       


    }



    //浏览兑奖页面
    private void Share()
    {
        context.Response.ContentType = "text/html";
        string id = Request.QueryString["id"];
        string path = HttpContext.Current.Server.MapPath("share.html");

        string html = File.ReadAllText(path);
        html = string.Format(html,id);
        Response.Write(html);


    }



    private Bitmap ResizeImage(Bitmap bmp, int newW, int newH)
    {
        try
        {
            Bitmap b = new Bitmap(newW, newH);
            Graphics g = Graphics.FromImage(b);
            // 插值算法的质量   
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.DrawImage(bmp, new Rectangle(0, 0, newW, newH), new Rectangle(0, 0, bmp.Width, bmp.Height), GraphicsUnit.Pixel);
            g.Dispose();
            return b;
        }
        catch
        {
            return null;
        }
    }

    private Image getImage(string name)
    {
        return Image.FromFile(HttpContext.Current.Server.MapPath("img/" + name));

    }

    private Rectangle suofang(double nW, double nH)
    {
        double tW = 640, tH = 920;
        double tB = tW / tH;
        double nB = nW / nH;
        double dW, dH, dX, dY;
        if (tB > nB)
        {
            dW = nW;
            dH = tH / tW * dW;
        }
        else
        {
            dH = nH;
            dW = tW / tH * dH;
        }
        dX = (nW - dW) / 2;
        dY = (nH - dH) / 2;
        Rectangle r = new Rectangle(
            (int)dX, (int)dY, (int)dW, (int)dH
            );







        return r;
    }

    //保存分享照片
    private void SaveImage()
    {
        context.Response.ContentType = "text/html";

      
        string isIphone = Request.Form["isIphone"];
        string guid = DateTime.Now.Ticks.ToString();
        string filename = guid + ".png";
        string filepath = HttpContext.Current.Server.MapPath("./save/" + filename);

        HttpPostedFile file = Request.Files["mfile"];


        Image img = Image.FromStream(file.InputStream);
        if (!string.IsNullOrEmpty(isIphone) && isIphone == "yes")
        {
            img.RotateFlip(RotateFlipType.Rotate90FlipNone);
        }
        Rectangle srcR = suofang(img.Width, img.Height);
        Image bitmap = new Bitmap(640, 1136);
        Image bg = getImage("bg.png");
        Graphics g = Graphics.FromImage(bitmap);

        g.InterpolationMode = InterpolationMode.High;
        g.SmoothingMode = SmoothingMode.HighQuality;
        g.Clear(Color.Transparent);


         g.DrawImage(bg, 
            new Rectangle(0,0,640,1136),
            new Rectangle(0,0,640,1136),
             GraphicsUnit.Pixel
            );
      

        g.DrawImage(img,
            new Rectangle(0, 0, 640, 920),
            srcR,
            GraphicsUnit.Pixel
           );

       
        g.Dispose();
        bitmap.Save(filepath);

        Response.Write(string.Format(@"
<script type=""text/javascript"">
    location.href = ""video.ashx?a=v&id={0}""
</script>
", guid));


        //        File.WriteAllBytes(path, bpath);


        //        Response.Write(result);

    }

    private void script(string s)
    {
        Response.Write(string.Format(@"<script type=""text/javascript"">{0}</script>", s));
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}